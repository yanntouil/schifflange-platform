import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { updateCategoryTranslation, withArticleCount } from '#models/article'
import ArticleCategory, { preloadArticleCategory } from '#models/article-category'
import { withArticleCategoryTranslations } from '#models/article-category-translation'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import {
  createArticleCategoryValidator,
  filterArticleCategoriesByValidator,
  sortArticleCategoriesByValidator,
  updateArticleCategoryValidator,
} from '#validators/articles'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ArticleCategoriesController
 */
export default class ArticleCategoriesController {
  /**
   * all
   * @get workspaces/:workspaceId/articles/categories
   * @middleware authActive workspace({as 'member'})
   * @success 200 { categories: ArticleCategory[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterArticleCategoriesByValidator)
    const sortBy = await request.sortBy(sortArticleCategoriesByValidator)
    const limit = await request.limit()

    const categories = await ArticleCategory.query()
      .where('workspaceId', workspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload(...withArticleCategoryTranslations())
      .withCount(...withArticleCount())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .orderBy('order', 'desc')
    return response.ok({ categories: A.map(categories, (category) => category.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/articles/categories
   * @middleware authActive workspace({as 'member'})
   * @success 201 { category: ArticleCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, ...payload } = await request.validateUsing(createArticleCategoryValidator)
    const now = DateTime.now()

    const category = await ArticleCategory.create({
      workspaceId: workspace.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await category.refresh()
    await updateCategoryTranslation(category, translations)
    await category.load(preloadArticleCategory)
    return response.ok({ category: category.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/articles/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: ArticleCategory }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const category = await ArticleCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withArticleCategoryTranslations())
      .withCount(...withArticleCount())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ category: category.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/articles/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: ArticleCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const category = await ArticleCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .withCount(...withArticleCount())
      .preload(...withArticleCategoryTranslations())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    const { translations, ...payload } = await request.validateUsing(updateArticleCategoryValidator)
    const now = DateTime.now()
    await updateCategoryTranslation(category, translations)

    await category
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()
    await category.load(preloadArticleCategory)

    return response.ok({ category: category.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/articles/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const category = await ArticleCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    await category.delete()

    return response.noContent()
  }
}
