import Article from '#models/article'
import ArticleCategoryTranslation, {
  withArticleCategoryTranslations,
} from '#models/article-category-translation'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import User, { withCreatedBy, withUpdatedBy } from '#models/user'
import {
  filterArticleCategoriesByValidator,
  sortArticleCategoriesByValidator,
} from '#validators/articles'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model for Article (CMS)
 * article is a cms container for a article
 */
type Model = ArticleCategory
export default class ArticleCategory extends ExtendedModel {
  public static table = 'article_categories'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare order: number

  @hasMany(() => ArticleCategoryTranslation, {
    foreignKey: 'categoryId',
  })
  declare translations: HasMany<typeof ArticleCategoryTranslation>

  @hasMany(() => Article, { foreignKey: 'categoryId' })
  declare articles: HasMany<typeof Article>

  @column({ serializeAs: null })
  declare workspaceId: string | null

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
    ressource.order ??= 0
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const languages = await Language.all()
    await Promise.all(
      A.map(languages, async (language) => {
        await ressource.related('translations').create({ languageId: language.id })
      })
    )
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTEDS
   */

  @computed()
  public get totalArticles() {
    return this.$extras?.totalArticles ?? 0
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope(
    (query, filterBy: Infer<typeof filterArticleCategoriesByValidator>) => {
      if (D.isEmpty(filterBy)) return query
      // const {  } = filterBy
    }
  )

  public static sortBy = scope((query, sortBy: Infer<typeof sortArticleCategoriesByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static limit = scope((query, limit: number | undefined) => {
    if (G.isNullable(limit)) return query
    return query.limit(limit)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'createdById',
        'createdBy',
        'createdAt',
        'updatedById',
        'updatedBy',
        'updatedAt',
      ]),
      translations: A.find(
        this.translations,
        (translation) => translation.languageId === language.id
      )?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(await this.getOrLoadRelation('translations'), ({ cleanup }) => cleanup())
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
 * preloaders
 */
export const preloadArticleCategory = (query: PreloaderContract<ArticleCategory>) =>
  query
    .preload(...withArticleCategoryTranslations())
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())
export const withArticleCategory = () => ['category', preloadArticleCategory] as const

export const preloadPublicArticleCategory = (query: PreloaderContract<ArticleCategory>) =>
  query.preload(...withArticleCategoryTranslations())
export const withPublicArticleCategory = () => ['category', preloadPublicArticleCategory] as const
