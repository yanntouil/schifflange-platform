import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadContent } from '#models/content'
import Project, { preloadCategory, preloadVisits } from '#models/project'
import { preloadProjectSteps } from '#models/project-step'
import { preloadProjectTag } from '#models/project-tag'
import { preloadPublicPublication } from '#models/publication'
import { preloadSeo } from '#models/seo'
import { withProfile } from '#models/user'
import { validationFailure } from '#start/vine'
import {
  createProjectValidator,
  filterProjectsByValidator,
  sortProjectsByValidator,
  updateProjectValidator,
} from '#validators/projects'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ProjectsController
 */
export default class ProjectsController {
  /**
   * all
   * @get workspaces/:workspaceId/projects
   * @middleware authActive workspace({as 'member'})
   * @success 200 { projects: Project[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterProjectsByValidator)
    const sortBy = await request.sortBy(sortProjectsByValidator)
    const limit = await request.limit()
    const projects = await workspace
      .related('projects')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('seo', preloadSeo)
      .preload('content', preloadContent)
      .preload('tracking', preloadVisits)
      .preload('slug')
      .preload('publication', preloadPublicPublication)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .preload('category', preloadCategory)
      .preload('tag', preloadProjectTag)
      .preload('steps', preloadProjectSteps)
    return response.ok({ projects: A.map(projects, (project) => project.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/projects
   * @middleware authActive workspace({as 'member'})
   * @success 201 { project: Project }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { categoryId, tagId, ...payload } = await request.validateUsing(createProjectValidator)
    const now = DateTime.now()

    // check if category exists in workspace
    if (G.isNotNullable(categoryId)) {
      const category = await workspace
        .related('projectCategories')
        .query()
        .where('id', categoryId)
        .first()
      if (G.isNullable(category))
        return response.badRequest(validationFailure([{ field: 'categoryId', rule: 'exist' }]))
    }

    // check if tag exists in workspace

    if (G.isNotNullable(tagId)) {
      const tag = await workspace.related('projectTags').query().where('id', tagId).first()
      if (G.isNullable(tag))
        return response.badRequest(validationFailure([{ field: 'tagId', rule: 'exist' }]))
    }

    const project = await Project.create({
      workspaceId: workspace.id,
      ...payload,
      categoryId,
      tagId,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })
    await project.refresh()
    await project.load((query) =>
      query
        .preload('category', preloadCategory)
        .preload('tag', preloadProjectTag)
        .preload('seo', preloadSeo)
        .preload('content', preloadContent)
        .preload('tracking', preloadVisits)
        .preload('slug')
        .preload('publication', preloadPublicPublication)
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
        .preload('steps', preloadProjectSteps)
    )
    return response.ok({ project: project.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/projects/:projectId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { project: Project }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const project = await Project.query()
      .where('id', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .preload('tag', preloadProjectTag)
      .preload('seo', preloadSeo)
      .preload('content', preloadContent)
      .preload('tracking', preloadVisits)
      .preload('slug')
      .preload('publication', preloadPublicPublication)
      .preload('category', preloadCategory)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .preload('steps', preloadProjectSteps)
      .first()
    if (G.isNullable(project)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ project: project.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/projects/:projectId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { project: Project }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const project = await Project.query()
      .where('id', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(project)) throw E_RESOURCE_NOT_FOUND

    const { categoryId, tagId, ...payload } = await request.validateUsing(updateProjectValidator)
    const now = DateTime.now()

    // check if category exists in workspace
    if (G.isNotNullable(categoryId)) {
      const category = await workspace
        .related('projectCategories')
        .query()
        .where('id', categoryId)
        .first()
      if (G.isNullable(category))
        return response.badRequest(validationFailure([{ field: 'categoryId', rule: 'exist' }]))
      project.categoryId = categoryId
    } else if (!G.isUndefined(categoryId)) project.categoryId = null

    // check if tag exists in workspace

    if (G.isNotNullable(tagId)) {
      const tag = await workspace.related('projectTags').query().where('id', tagId).first()
      if (G.isNullable(tag))
        return response.badRequest(validationFailure([{ field: 'tagId', rule: 'exist' }]))
      project.tagId = tagId
    } else if (!G.isUndefined(tagId)) project.tagId = null

    await project
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await project.load((query) =>
      query
        .preload('tag', preloadProjectTag)
        .preload('seo', preloadSeo)
        .preload('content', preloadContent)
        .preload('tracking', preloadVisits)
        .preload('slug')
        .preload('publication', preloadPublicPublication)
        .preload('category', preloadCategory)
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
        .preload('steps', preloadProjectSteps)
    )

    return response.ok({ project: project.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/projects/:projectId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const project = await Project.query()
      .where('id', request.param('projectId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(project)) throw E_RESOURCE_NOT_FOUND

    await project.delete()

    return response.noContent()
  }
}
