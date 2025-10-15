import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadProjects, updateCategoryTranslation } from '#models/project'
import ProjectCategory from '#models/project-category'
import { preloadFiles } from '#models/media-file'
import { withProfile } from '#models/user'
import {
  createProjectCategoryValidator,
  filterProjectCategoriesByValidator,
  sortProjectCategoriesByValidator,
  updateProjectCategoryValidator,
} from '#validators/projects'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ProjectCategoriesController
 */
export default class ProjectCategoriesController {
  /**
   * all
   * @get workspaces/:workspaceId/projects/categories
   * @middleware authActive workspace({as 'member'})
   * @success 200 { categories: ProjectCategory[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterProjectCategoriesByValidator)
    const sortBy = await request.sortBy(sortProjectCategoriesByValidator)
    const limit = await request.limit()

    const categories = await ProjectCategory.query()
      .where('workspaceId', workspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('translations', (query) => query.preload('image', preloadFiles))
      .withCount('projects', (query) => query.as('totalProjects'))
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .orderBy('order', 'desc')
    return response.ok({ categories: A.map(categories, (category) => category.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/projects/categories
   * @middleware authActive workspace({as 'member'})
   * @success 201 { category: ProjectCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, ...payload } = await request.validateUsing(createProjectCategoryValidator)
    const now = DateTime.now()

    const category = await ProjectCategory.create({
      workspaceId: workspace.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await category.refresh()
    await updateCategoryTranslation(category, translations)
    await category.load((query) =>
      query.preload('createdBy', withProfile).preload('updatedBy', withProfile)
    )
    return response.ok({ category: { ...category.serialize(), totalProjects: 0 } })
  }

  /**
   * read
   * @get workspaces/:workspaceId/projects/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: ProjectCategory }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const category = await ProjectCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .preload('translations', (query) => query.preload('image', preloadFiles))
      .preload('projects', preloadProjects)
      .withCount('projects', (query) => query.as('totalProjects'))
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ category: category.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/projects/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: ProjectCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const category = await ProjectCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .withCount('projects', (query) => query.as('totalProjects'))
      .preload('translations')
      .preload('createdBy', withProfile)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    const { translations, ...payload } = await request.validateUsing(updateProjectCategoryValidator)
    const now = DateTime.now()
    await updateCategoryTranslation(category, translations)

    await category
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()
    await category.load((query) => query.preload('updatedBy', withProfile))

    return response.ok({ category: category.serialize() })
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
    const category = await ProjectCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    await category.delete()

    return response.noContent()
  }
}