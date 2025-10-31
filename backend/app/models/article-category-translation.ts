import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile, { withImage } from '#models/media-file'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'

/**
 * Model for Article Category Translation (CMS)
 * article category translation is a translation part of a article category
 */
type Model = ArticleCategoryTranslation
export default class ArticleCategoryTranslation extends ExtendedModel {
  public static table = 'article_category_translations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column({ serializeAs: null })
  declare categoryId: string

  @column()
  declare languageId: string
  @belongsTo(() => Language, { foreignKey: 'languageId' })
  declare language: BelongsTo<typeof Language>

  @column()
  declare title: string
  @column()
  declare description: string

  @column()
  declare imageId: string | null
  @belongsTo(() => MediaFile, { foreignKey: 'imageId' })
  declare image: BelongsTo<typeof MediaFile>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static beforeCreateHook(ressource: Model) {
    ressource.title ??= ''
    ressource.description ??= ''
    ressource.imageId ??= null
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    language // unused
    return {
      ...this.serialize(),
      image: this.image?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    //
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
export const preloadArticleCategoryTranslation = (
  query: PreloaderContract<ArticleCategoryTranslation>
) => query.preload(...withImage())
export const withArticleCategoryTranslations = () =>
  ['translations', preloadArticleCategoryTranslation] as const
