import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { withSoftArticle } from '#models/article'
import { withSoftEvent } from '#models/event'
import Forward from '#models/forward'
import { withSoftPage } from '#models/page'
import Slug from '#models/slug'
import { updateSlugValidator } from '#validators/slugs'
import type { HttpContext } from '@adonisjs/core/http'
import { G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * SlugsController
 */
export default class SlugsController {
  /**
   * all
   * get all slugs for a workspace
   * @get workspaces/:workspaceId/slugs
   * @middleware authActive workspace({as 'member'})
   * @success 200 { slugs: Slug[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ workspace, response }: HttpContext) {
    const slugs = await Slug.query()
      .where('workspaceId', workspace.id)
      .preload(...withSoftArticle())
      .preload(...withSoftPage())
      .preload(...withSoftEvent())
    response.ok({ slugs })
  }

  /**
   * update
   * update the slug of a collection item
   * @put workspaces/:workspaceId/slugs/:slugId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { seo: Seo }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const slug = await Slug.query()
      .where('workspaceId', workspace.id)
      .andWhere('id', request.param('slugId'))
      .preload(...withSoftArticle())
      .preload(...withSoftPage())
      .preload(...withSoftEvent())
      .first()
    if (G.isNullable(slug)) throw E_RESOURCE_NOT_FOUND

    const payload = await request.validateUsing(updateSlugValidator)

    if (payload.slug !== slug.slug) {
      slug.slug = payload.slug
    }

    if (payload.path !== slug.path) {
      // create a forward for the old path if not already exists
      const forward = await Forward.query()
        .where('workspaceId', workspace.id)
        .andWhere('slugId', slug.id)
        .andWhere('path', slug.path)
        .first()
      if (G.isNullable(forward)) {
        await Forward.create({ slugId: slug.id, path: slug.path, workspaceId: workspace.id })
      } else {
        await forward.merge({ updatedAt: DateTime.now() }).save()
      }
      slug.path = payload.path
    }

    if (slug.$isDirty) {
      await slug.save()
      await (slug.page || slug.article || slug.event)
        ?.merge({ updatedAt: DateTime.now(), updatedById: user.id })
        .save()
    }

    response.ok({ slug })
  }
}
