import ContentItem from '#models/content-item'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { columnJSON } from '#utils/column-json'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'

/**
 * Model for Content Item Translation (CMS)
 * content item translation is a translation part of a content item
 */
type Model = ContentItemTranslation
export default class ContentItemTranslation extends ExtendedModel {
  public static table = 'content_item_translations'

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
  declare contentItemId: string
  @belongsTo(() => ContentItem, { foreignKey: 'contentItemId', serializeAs: null })
  declare contentItem: BelongsTo<typeof ContentItem>

  @column(columnJSON<Record<string, unknown>>({}))
  declare props: Record<string, unknown>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    language // unused
    return {
      ...D.deleteKeys(this.serialize(), ['languageId']),
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
