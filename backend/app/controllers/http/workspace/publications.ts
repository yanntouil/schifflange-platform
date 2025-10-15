import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Article from '#models/article'
import Publication, { preloadPublicPublication } from '#models/publication'
import { luxonOrJsDate } from '#utils/date'
import { updatePublicationValidator } from '#validators/publications'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * PublicationsController
 */
export default class PublicationsController {
  /**
   * update
   * update the publication of a collection item
   * @put workspaces/:workspaceId/collections/:collectionId/publication
   * @middleware authActive workspace({as 'member'})
   * @success 200 { publication: Publication }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const { Model, modelId } = getModel(request)
    const item = await Model.query()
      .where('id', modelId)
      .andWhere('workspaceId', workspace.id)
      .preload('publication', preloadPublicPublication)
      .first()
    if (G.isNullable(item) || G.isNullable(item.publication)) throw E_RESOURCE_NOT_FOUND

    const { publishedAt, publishedFrom, publishedTo, publishedById } = await request.validateUsing(
      updatePublicationValidator
    )
    const now = DateTime.now()

    if (!G.isUndefined(publishedAt)) {
      item.publication.publishedAt = luxonOrJsDate(publishedAt)
    }

    if (!G.isUndefined(publishedById)) {
      if (G.isNullable(publishedById)) {
        item.publication.publishedById = null
      } else {
        const publishedBy = A.find(workspace.members, (member) => member.id === publishedById)
        if (G.isNotNullable(publishedBy)) {
          item.publication.publishedById = publishedBy.id
        }
      }
    }

    item.publication.merge(
      Publication.parseInterval({ publishedFrom, publishedTo }, item.publication)
    )

    // Update publication
    if (item.publication.isDirty()) {
      await item.publication.save()
      // Update collection timestamp
      await item
        .merge({
          updatedById: user.id,
          updatedAt: now,
        })
        .save()

      // Reload relations
      await item.publication.load('publishedBy', (query) => query.preload('profile'))
      await item.publication.load('updatedBy', (query) => query.preload('profile'))
    }

    response.ok({ publication: item.publication.serialize() })
  }
}

/**
 * related model bridge
 */
const getModel = (request: HttpContext['request']) => {
  if (G.isNotNullable(request.param('articleId')))
    return { Model: Article, modelId: request.param('articleId') }
  // Future: Add other models with publication feature here
  throw new Error('Model not found')
}
