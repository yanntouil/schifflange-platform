import ArticleCategory, { withArticleCategory } from '#models/article-category'
import Content, { withContent } from '#models/content'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { preloadFiles } from '#models/media-file'
import Seo, { withSeo } from '#models/seo'
import Slug from '#models/slug'
import Tracking, { withVisits } from '#models/tracking'
import User, { withCreatedBy, withUpdatedBy } from '#models/user'
import {
  filterArticlesByValidator,
  sortArticlesByValidator,
  updateArticleCategoryValidator,
} from '#validators/articles'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  scope,
} from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  ExtractModelRelations,
  PreloaderContract,
  RelationSubQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G, S } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import Publication, { withPublication } from './publication.js'
import { makeWorkspaceConfig } from './workspace-config.js'
import Workspace from './workspace.js'

/**
 * Model for Article (CMS)
 * article is a cms container for a article
 */
type Model = Article
export default class Article extends ExtendedModel {
  public static table = 'articles'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare seoId: string
  @belongsTo(() => Seo, { foreignKey: 'seoId' })
  declare seo: BelongsTo<typeof Seo>

  @column({ serializeAs: null })
  declare contentId: string
  @belongsTo(() => Content, { foreignKey: 'contentId' })
  declare content: BelongsTo<typeof Content>

  @column()
  declare trackingId: string
  @belongsTo(() => Tracking, { foreignKey: 'trackingId' })
  declare tracking: BelongsTo<typeof Tracking>

  @column()
  declare slugId: string
  @belongsTo(() => Slug, { foreignKey: 'slugId' })
  declare slug: BelongsTo<typeof Slug>

  @column()
  declare categoryId: string | null
  @belongsTo(() => ArticleCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof ArticleCategory>

  @column()
  declare state: ArticleState

  @column()
  declare publicationId: string | null
  @belongsTo(() => Publication, { foreignKey: 'publicationId' })
  declare publication: BelongsTo<typeof Publication>

  @column({ serializeAs: null })
  declare workspaceId: string | null
  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

  @column()
  declare createdById: string | null
  @belongsTo(() => User, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare updatedById: string | null
  @belongsTo(() => User, { foreignKey: 'updatedById' })
  declare updatedBy: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(ressource: Model) {
    const client = ressource.$trx
    const [seo, content, publication, tracking, slug] = await Promise.all([
      Seo.create({}, { client }),
      Content.create({}, { client }),
      Publication.create({}, { client }),
      Tracking.create(
        { type: 'views', model: 'article', workspaceId: ressource.workspaceId },
        { client }
      ),
      Slug.create({ model: 'article', workspaceId: ressource.workspaceId }, { client }),
    ])
    ressource.seoId = seo.id
    ressource.contentId = content.id
    ressource.publicationId = publication.id
    ressource.trackingId = tracking.id
    ressource.slugId = slug.id
    ressource.state ??= articleDefaultState
    ressource.categoryId ??= null
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const slug = await ressource.getOrLoadRelation('slug')
    // get slug prefix from workspace config or use default one
    const slugPrefix =
      (await ressource.getOrLoadRelation('workspace'))?.config.articles?.slugPrefix ??
      makeWorkspaceConfig().articles.slugPrefix
    slug
      ?.merge({ slug: `${slugPrefix}/${ressource.id}`, path: `${slugPrefix}/${ressource.id}` })
      .save()
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filterBy: Infer<typeof filterArticlesByValidator>) => {
    if (D.isEmpty(filterBy)) return query
    const { categories, in: inIds, isPublished } = filterBy
    if (G.isNotNullable(categories)) query.andWhereIn('categoryId', categories)
    if (G.isNotNullable(inIds)) query.andWhereIn('id', inIds)
    if (G.isNotNullable(isPublished)) query.andWhere('state', isPublished ? 'published' : 'draft')
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortArticlesByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: string | undefined, language: Language) => {
    if (G.isNullable(search) || S.isEmpty(search)) return
    language // unused
    return query
    // return query.whereHas('seo', (query) =>
    //   query.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
    // )
  })

  public static limit = scope((query, limit: number | undefined) => {
    if (G.isNullable(limit)) return query
    return query.limit(limit)
  })

  public static isPublished = scope((query: ModelQueryBuilderContract<typeof Article, Article>) => {
    return query.where('state', 'published').whereHas('publication', (publicationQuery) => {
      publicationQuery
        .where((subQuery: any) =>
          subQuery.where('publishedFrom', '<=', DateTime.now().toSQL()).orWhereNull('publishedFrom')
        )
        .andWhere((subQuery: any) =>
          subQuery.where('publishedTo', '>=', DateTime.now().toSQL()).orWhereNull('publishedTo')
        )
    })
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'publishedTo',
        'publishedFrom',
        'slugId',
        'state',
        'authorId',
        'createdById',
        'updatedById',
        'createdAt',
        'updatedAt',
      ]),
      trackingId: this.trackingId,
      seo: this.seo?.publicSerialize(language),
      content: this.content?.publicSerialize(language),
      category: this.category?.publicSerialize(language),
      publication: this.publication?.publicSerialize(language),
      slug: this.slug?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(['seo', 'content', 'tracking', 'slug', 'publication'] as const, async (related) =>
        (await this.getOrLoadRelation(related)).delete()
      )
    )
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }
}

/**
 * constants and types related to articles
 */
export const articleStates = ['draft', 'published'] as const
export type ArticleState = (typeof articleStates)[number]
export const articleDefaultState = articleStates[0]

/**
 * preloaders
 */
export const preloadArticle = (query: PreloaderContract<Article>) =>
  query
    .preload(...withArticleCategory())
    .preload(...withSeo())
    .preload(...withContent())
    .preload(...withVisits())
    .preload(...withPublication())
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())
export const withArticle = () => ['articles', preloadArticle] as const
export const withSoftArticle = () =>
  ['article', (query: PreloaderContract<Article>) => query.preload(...withSeo())] as const
export const withArticles = () => ['articles', preloadArticle] as const
export const withArticleCount = () =>
  [
    'articles',
    (query: RelationSubQueryBuilderContract<typeof Article>) => query.as('totalArticles'),
  ] as const

/**
 * utils
 */
export const defaultInterval = { publishedFrom: null, publishedTo: null }
export const parseInterval = (
  valid: {
    publishedFrom?: Date | null
    publishedTo?: Date | null
  },
  fallback: {
    publishedFrom: DateTime | null
    publishedTo: DateTime | null
  }
): { publishedFrom: DateTime<true> | null; publishedTo: DateTime<true> | null } => {
  // Convert the Date (from front) to DateTime (Luxon) if defined
  const publishedFrom = G.isUndefined(valid.publishedFrom)
    ? fallback.publishedFrom
    : G.isNullable(valid.publishedFrom)
      ? null
      : DateTime.fromJSDate(valid.publishedFrom)
  const publishedTo = G.isUndefined(valid.publishedTo)
    ? fallback.publishedTo
    : G.isNullable(valid.publishedTo)
      ? null
      : DateTime.fromJSDate(valid.publishedTo)
  // If both dates are null or fallback values
  if (G.isNullable(publishedFrom) && G.isNullable(publishedTo))
    return { publishedFrom, publishedTo }
  // from date to ever OR from ever to date
  if ((publishedFrom && !publishedTo) || (!publishedFrom && publishedTo))
    return { publishedFrom, publishedTo }
  // from date to date
  if (publishedFrom && publishedTo && publishedFrom <= publishedTo)
    return { publishedFrom, publishedTo }
  // Return fallback if no valid dates
  return fallback
}

export const updateCategoryTranslation = async (
  category: ArticleCategory,
  payload: Infer<typeof updateArticleCategoryValidator>['translations']
) => {
  await category.getOrLoadRelation('translations')
  if (G.isNotNullable(payload)) {
    const languages = A.map(await Language.all(), D.prop('id'))
    await Promise.all(
      A.map(D.toPairs(payload), async ([languageId, translation]) => {
        // Step 1 - check if language is supported
        if (!languages.includes(languageId)) return
        // Step 2 - check if translation already exists
        const current = A.find(category.translations, (t) => t.languageId === languageId)
        // Step 3 - update or create translation
        if (G.isNotNullable(current)) return current.merge(translation).save()
        else return category.related('translations').create({ languageId, ...translation })
      })
    )
    await category.load('translations', (query) => query.preload('image', preloadFiles))
  }
}

/**
 * check if an article is available
 */
export const isAvailableArticle = async (article: Article) => {
  if (article.state !== 'published') return false
  const publication = await article.getOrLoadRelation('publication')
  const now = DateTime.now()
  const isAfterFrom = publication.publishedFrom ? now <= publication.publishedFrom : true
  const isBeforeUntil = publication.publishedTo ? now >= publication.publishedTo : true
  return isAfterFrom && isBeforeUntil
}
