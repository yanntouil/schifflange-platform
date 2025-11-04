import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Article from '#models/article'
import Event from '#models/event'
import Language from '#models/language'
import Page from '#models/page'
import Seo, { preloadSeo, withSeo } from '#models/seo'
import SeoTranslation from '#models/seo-translation'
import Workspace from '#models/workspace'
import { updateSeoValidator } from '#validators/seo'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

export default class SeosController {
  /**
   * update
   * update the seo of a collection item
   * @put workspaces/:workspaceId/collections/:collectionId/seo
   * @middleware authActive workspace({as 'member'})
   * @success 200 { seo: Seo }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const item = await getModelResource(request, workspace)
    if (G.isNullable(item) || G.isNullable(item.seo)) throw E_RESOURCE_NOT_FOUND
    const { translations, ...payload } = await request.validateUsing(updateSeoValidator)

    // update translations
    await updateSeoTranslation(item.seo, translations)

    // merge files from translations and payload
    const files = A.uniq([...fileFromTranslations(item.seo.translations), ...(payload.files ?? [])])

    // sync files, only files present in the payload and updated translations will be kept
    if (A.isNotEmpty(files)) {
      await item.seo.related('files').sync(files)
      await item.seo.load('files', (query) => query.preload('translations'))
    }

    // update collection and seo timestamp
    await item.merge({ updatedById: user.id, updatedAt: DateTime.now() }).save()
    await item.seo.merge({ updatedById: user.id, updatedAt: DateTime.now() }).save()
    await item.seo.load(preloadSeo)
    response.ok({ seo: item.seo.serialize() })
  }
}

/**
 * related model bridge
 */
const getModelResource = async (request: HttpContext['request'], workspace: Workspace) => {
  if (G.isNotNullable(request.param('pageId')))
    return await Page.query()
      .where('id', request.param('pageId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withSeo())
      .first()
  if (G.isNotNullable(request.param('articleId')))
    return await Article.query()
      .where('id', request.param('articleId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withSeo())
      .first()
  if (G.isNotNullable(request.param('eventId')))
    return await Event.query()
      .where('id', request.param('eventId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withSeo())
      .first()
  throw new Error('Model not found')
}

/**
 * utils
 */
const fileFromTranslations = (translations: SeoTranslation[]): string[] => {
  return A.reduce(translations, [] as string[], (translationsFiles, translation) => [
    ...translationsFiles,
    ...A.reduce(translation.socials ?? [], [] as string[], (socialsFiles, { imageId }) => [
      ...socialsFiles,
      ...(imageId ? [imageId] : []),
    ]),
  ])
}
const updateSeoTranslation = async (seo: Seo, translations: Payload['translations']) => {
  if (G.isNotNullable(translations)) {
    const languages = A.map(await Language.all(), D.prop('id'))
    await Promise.all(
      A.map(D.toPairs(translations), async ([languageId, translation]) => {
        // Step 1 - check if language is supported
        if (!languages.includes(languageId)) return
        // Step 2 - check if translation already exists
        const current = A.find(seo.translations, (t) => t.languageId === languageId)
        // Step 3 - update or create translation
        if (G.isNotNullable(current)) {
          return current.merge(translation).save()
        } else return seo.related('translations').create({ languageId, ...translation })
      })
    )
  }
}

/**
 * type Payload
 */
type Payload = Infer<typeof updateSeoValidator>
