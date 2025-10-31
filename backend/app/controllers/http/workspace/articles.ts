import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Article, { preloadArticle } from '#models/article'
import { withArticleCategory } from '#models/article-category'
import { withContent } from '#models/content'
import { withPublication } from '#models/publication'
import { withSeo } from '#models/seo'
import { withSlug } from '#models/slug'
import { withVisits } from '#models/tracking'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import { validationFailure } from '#start/vine'
import {
  createArticleValidator,
  filterArticlesByValidator,
  sortArticlesByValidator,
  updateArticleValidator,
} from '#validators/articles'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ArticlesController
 */
export default class ArticlesController {
  /**
   * all
   * @get workspaces/:workspaceId/articles
   * @middleware authActive workspace({as 'member'})
   * @success 200 { articles: Article[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterArticlesByValidator)
    const sortBy = await request.sortBy(sortArticlesByValidator)
    const limit = await request.limit()
    const articles = await workspace
      .related('articles')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload(...withSeo())
      .preload(...withContent())
      .preload(...withVisits())
      .preload(...withSlug())
      .preload(...withPublication())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .preload(...withArticleCategory())
    return response.ok({ articles: A.map(articles, (article) => article.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/articles
   * @middleware authActive workspace({as 'member'})
   * @success 201 { article: Article }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { categoryId, ...payload } = await request.validateUsing(createArticleValidator)
    const now = DateTime.now()

    // check if category exists in workspace
    if (G.isNotNullable(categoryId)) {
      const category = await workspace
        .related('articleCategories')
        .query()
        .where('id', categoryId)
        .first()
      if (G.isNullable(category))
        return response.badRequest(validationFailure([{ field: 'categoryId', rule: 'exist' }]))
    }

    const article = await Article.create({
      workspaceId: workspace.id,
      ...payload,
      categoryId,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })
    await article.refresh()
    await article.load(preloadArticle)
    return response.ok({ article: article.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/articles/:articleId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { article: Article }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const article = await Article.query()
      .where('id', request.param('articleId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withSeo())
      .preload(...withContent())
      .preload(...withVisits())
      .preload(...withSlug())
      .preload(...withPublication())
      .preload(...withArticleCategory())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(article)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ article: article.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/articles/:articleId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { article: Article }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const article = await Article.query()
      .where('id', request.param('articleId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(article)) throw E_RESOURCE_NOT_FOUND

    const { categoryId, ...payload } = await request.validateUsing(updateArticleValidator)
    const updatedAt = DateTime.now()

    // check if category exists in workspace
    if (G.isNotNullable(categoryId)) {
      const category = await workspace
        .related('articleCategories')
        .query()
        .where('id', categoryId)
        .first()
      if (G.isNullable(category))
        return response.badRequest(validationFailure([{ field: 'categoryId', rule: 'exist' }]))
      article.categoryId = categoryId
    } else if (!G.isUndefined(categoryId)) article.categoryId = null

    await article.merge({ ...payload, updatedAt, updatedById: user.id }).save()

    await article.load(preloadArticle)

    return response.ok({ article: article.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/articles/:articleId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const article = await Article.query()
      .where('id', request.param('articleId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(article)) throw E_RESOURCE_NOT_FOUND

    await article.delete()

    return response.noContent()
  }
}
