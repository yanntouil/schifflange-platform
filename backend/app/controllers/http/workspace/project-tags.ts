import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadProjects, updateTagTranslation } from '#models/project'
import ProjectTag from '#models/project-tag'
import { withProfile } from '#models/user'
import { createProjectTagValidator, updateProjectTagValidator } from '#validators/projects'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ProjectTagsController
 */
export default class ProjectTagsController {
  /**
   * all
   * @get workspaces/:workspaceId/projects/tags
   * @middleware authActive workspace({as 'member'})
   * @success 200 { tags: ProjectTag[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ workspace, response }: HttpContext) {
    const tags = await ProjectTag.query()
      .where('workspaceId', workspace.id)
      .preload('translations')
      .withCount('projects', (query) => query.as('totalProjects'))
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .orderBy('order', 'desc')
    return response.ok({ tags: A.map(tags, (tag) => tag.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/projects/tags
   * @middleware authActive workspace({as 'member'})
   * @success 201 { tag: ProjectTag }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, ...payload } = await request.validateUsing(createProjectTagValidator)
    const now = DateTime.now()

    const tag = await ProjectTag.create({
      workspaceId: workspace.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await tag.refresh()
    await updateTagTranslation(tag, translations)
    await tag.load((query) =>
      query.preload('createdBy', withProfile).preload('updatedBy', withProfile)
    )
    return response.ok({ tag: { ...tag.serialize(), totalProjects: 0 } })
  }

  /**
   * read
   * @get workspaces/:workspaceId/projects/tags/:tagId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { tag: ProjectTag }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const tag = await ProjectTag.query()
      .where('id', request.param('tagId'))
      .andWhere('workspaceId', workspace.id)
      .preload('translations')
      .preload('projects', preloadProjects)
      .withCount('projects', (query) => query.as('totalProjects'))
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(tag)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ tag: tag.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/projects/tags/:tagId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { tag: ProjectTag }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const tag = await ProjectTag.query()
      .where('id', request.param('tagId'))
      .andWhere('workspaceId', workspace.id)
      .withCount('projects', (query) => query.as('totalProjects'))
      .preload('translations')
      .preload('createdBy', withProfile)
      .first()
    if (G.isNullable(tag)) throw E_RESOURCE_NOT_FOUND

    const { translations, ...payload } = await request.validateUsing(updateProjectTagValidator)
    const now = DateTime.now()
    await updateTagTranslation(tag, translations)

    await tag
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()
    await tag.load((query) => query.preload('updatedBy', withProfile))

    return response.ok({ tag: tag.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/projects/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const tag = await ProjectTag.query()
      .where('id', request.param('tagId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(tag)) throw E_RESOURCE_NOT_FOUND

    await tag.delete()

    return response.noContent()
  }
}
