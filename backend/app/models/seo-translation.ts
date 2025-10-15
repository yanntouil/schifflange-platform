import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile from '#models/media-file'
import Seo from '#models/seo'
import { columnJSON } from '#utils/column-json'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'

/**
 * Model for SEO Translation (CMS)
 * seo translation is a translation part of a seo
 */
type Model = SeoTranslation
export default class SeoTranslation extends ExtendedModel {
  public static table = 'seo_translations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column()
  declare languageId: string
  @belongsTo(() => Language, { foreignKey: 'languageId' })
  declare language: BelongsTo<typeof Language>

  @column({ serializeAs: null })
  declare seoId: string
  @belongsTo(() => Seo, { foreignKey: 'seoId', serializeAs: null })
  declare seo: BelongsTo<typeof Seo>

  @column()
  declare title: string
  @column()
  declare description: string

  @column(columnJSON<string[]>([]))
  declare keywords: string[]

  @column(columnJSON<SeoSocialMeta[]>([]))
  declare socials: SeoSocialMeta[]

  @column({ serializeAs: null })
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
    ressource.keywords ??= []
    ressource.socials ??= []
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
    return {
      ...D.deleteKeys(this.serialize(), ['languageId']),
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
 * types
 */
export type SeoSocialMeta = {
  type: string
  title: string
  description: string
  imageId: string | null
}
