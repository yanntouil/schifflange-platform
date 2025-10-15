import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Forward from '#models/forward'
import Slug, { preloadSlug } from '#models/slug'
import { validationFailure } from '#start/vine'
import { createForwardValidator, updateForwardValidator } from '#validators/forwards'
import type { HttpContext } from '@adonisjs/core/http'
import { G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ForwardsController
 * todo : add scheduled task to delete forwards that are not used after 6 months
 */
export default class ForwardsController {
  /**
   * all
   * get all forwards
   * @get workspaces/:workspaceId/forwards
   * @middleware authActive workspace({as 'member'})
   * @success 200 { forwards: Forward[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ workspace, response }: HttpContext) {
    const forwards = await Forward.query()
      .where('workspaceId', workspace.id)
      .preload('slug', preloadSlug)
    response.ok({ forwards })
  }

  /**
   * create
   * create a forward
   * @post workspaces/:workspaceId/forwards
   * @middleware authActive workspace({as 'member'})
   * @success 200 { forward: Forward }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, request, response }: HttpContext) {
    const { slugId, path } = await request.validateUsing(createForwardValidator)

    // check if slug exists
    const slug = await Slug.query()
      .where('workspaceId', workspace.id)
      .andWhere('id', slugId)
      .first()
    if (G.isNullable(slug))
      return response.badRequest(validationFailure([{ field: 'slugId', rule: 'exist' }]))

    // check if forward already exists
    let forward = await Forward.query()
      .where('workspaceId', workspace.id)
      .andWhere('slugId', slugId)
      .andWhere('path', path)
      .first()
    if (G.isNotNullable(forward)) {
      // update the forward
      await forward.merge({ updatedAt: DateTime.now() }).save()
    } else {
      // create the forward
      forward = await Forward.create({ slugId, path, workspaceId: workspace.id })
    }
    await slug.refresh()
    await forward.load('slug', preloadSlug)

    response.ok({ forward })
  }

  /**
   * read
   * read a forward
   * @get workspaces/:workspaceId/forwards/:forwardId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { forward: Forward }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, params, response }: HttpContext) {
    const forward = await Forward.query()
      .where('workspaceId', workspace.id)
      .andWhere('id', params.forwardId)
      .preload('slug', preloadSlug)
      .first()
    if (G.isNullable(forward)) throw E_RESOURCE_NOT_FOUND
    response.ok({ forward })
  }

  /**
   * update
   * update a forward
   * @put workspaces/:workspaceId/forwards/:forwardId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { forward: Forward }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, params, request, response }: HttpContext) {
    const forward = await Forward.query()
      .where('workspaceId', workspace.id)
      .andWhere('id', params.forwardId)
      .first()
    if (G.isNullable(forward)) throw E_RESOURCE_NOT_FOUND

    const { path, slugId } = await request.validateUsing(updateForwardValidator)

    // check if slug exists
    const slug = await Slug.query()
      .where('workspaceId', workspace.id)
      .andWhere('id', slugId)
      .first()
    if (G.isNullable(slug))
      return response.badRequest(validationFailure([{ field: 'slugId', rule: 'exist' }]))

    await forward.merge({ path, slugId }).save()
    await forward.load('slug', preloadSlug)

    response.ok({ forward })
  }

  /**
   * delete
   * delete a forward
   * @delete workspaces/:workspaceId/forwards/:forwardId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { forward: Forward }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, params, response }: HttpContext) {
    const forward = await Forward.query()
      .where('workspaceId', workspace.id)
      .andWhere('id', params.forwardId)
      .first()
    if (G.isNullable(forward)) throw E_RESOURCE_NOT_FOUND
    await forward.delete()

    response.noContent()
  }
}
