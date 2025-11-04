import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Council, { withCouncilTranslations } from '#models/council'
import MediaFile, { withFiles } from '#models/media-file'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import { extractFilesFromVideo } from '#services/video'
import {
  createCouncilValidator,
  filterCouncilsByValidator,
  sortCouncilsByValidator,
  updateCouncilValidator,
} from '#validators/councils'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import { luxonOrJsDate } from '../../../../utils/date.js'

/**
 * CouncilsController
 */
export default class CouncilsController {
  /**
   * all
   * @get workspaces/:workspaceId/councils
   * @middleware authActive workspace({as 'member'})
   * @success 200 { councils: Council[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterCouncilsByValidator)
    const sortBy = await request.sortBy(sortCouncilsByValidator)
    const limit = await request.limit()
    const councils = await workspace
      .related('councils')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload(...withCouncilTranslations())
      .preload(...withFiles())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
    return response.ok({ councils: A.map(councils, (council) => council.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/councils
   * @middleware authActive workspace({as 'member'})
   * @success 201 { council: Council }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { date, video, translations, ...payload } =
      await request.validateUsing(createCouncilValidator)
    const now = DateTime.now()

    const fileIds = G.isNotNullable(video) ? extractFilesFromVideo(video) : undefined

    // Create council
    const council = await Council.create({
      workspaceId: workspace.id,
      ...payload,
      date: luxonOrJsDate(date) ?? now,
      video,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    // Attach files if provided
    if (G.isNotNullable(fileIds) && fileIds.length > 0) {
      const files = await MediaFile.query().whereIn('id', fileIds)
      await council.related('files').attach(A.map(files, (file) => file.id))
    }

    // Create translations
    await updateCouncilTranslations(council, translations)

    await council.refresh()
    await council.load((query) =>
      query
        .preload(...withCouncilTranslations())
        .preload(...withFiles())
        .preload(...withCreatedBy())
        .preload(...withUpdatedBy())
    )

    return response.ok({ council: council.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/councils/:councilId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { council: Council }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const council = await Council.query()
      .where('id', request.param('councilId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withCouncilTranslations())
      .preload(...withFiles())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(council)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ council: council.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/councils/:councilId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { council: Council }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const council = await Council.query()
      .where('id', request.param('councilId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(council)) throw E_RESOURCE_NOT_FOUND

    const { date, video, translations, ...payload } =
      await request.validateUsing(updateCouncilValidator)

    const fileIds = G.isNotNullable(video) ? extractFilesFromVideo(video) : undefined

    const updatedAt = DateTime.now()
    const newDate = luxonOrJsDate(date)
    if (G.isNotNullable(newDate)) {
      council.date = newDate
    }

    // Update council
    await council
      .merge({
        ...payload,
        video,
        updatedAt,
        updatedById: user.id,
      })
      .save()

    // Update files if provided
    if (G.isNotNullable(fileIds)) {
      const files = await MediaFile.query().whereIn('id', fileIds)
      await council.related('files').sync(A.map(files, (file) => file.id))
    }

    // Update translations
    await updateCouncilTranslations(council, translations)

    await council.load((query) =>
      query
        .preload(...withCouncilTranslations())
        .preload(...withFiles())
        .preload(...withCreatedBy())
        .preload(...withUpdatedBy())
    )
    return response.ok({ council: council.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/councils/:councilId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const council = await Council.query()
      .where('id', request.param('councilId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(council)) throw E_RESOURCE_NOT_FOUND

    await council.delete()

    return response.noContent()
  }
}

/**
 * Update council translations
 */
async function updateCouncilTranslations(
  item: Council,
  payloadTranslations?: Infer<typeof createCouncilValidator>['translations']
) {
  if (!payloadTranslations) return
  const Language = (await import('#models/language')).default
  const languages = await Language.query()
  const itemTranslations = await item.getOrLoadRelation('translations')
  await Promise.all(
    A.map(languages, async ({ id }) => {
      const existingTranslation = A.find(itemTranslations, (t) => t.languageId === id)
      const payload = G.isNotNullable(payloadTranslations[id]) ? payloadTranslations[id] : {}
      if (G.isNotNullable(existingTranslation)) return existingTranslation.merge(payload).save()
      return item.related('translations').create({ languageId: id, ...payload })
    })
  )
}
