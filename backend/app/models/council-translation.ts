import Council from '#models/council'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import MediaFile from './media-file.js'

/**
 * Model for Council Translation (CMS)
 * council translation is a translation part of a council
 */
type Model = CouncilTranslation
export default class CouncilTranslation extends ExtendedModel {
  public static table = 'council_translations'

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
  declare councilId: string
  @belongsTo(() => Council, { foreignKey: 'councilId', serializeAs: null })
  declare council: BelongsTo<typeof Council>

  @column({ serializeAs: null })
  declare reportId: string | null
  @belongsTo(() => MediaFile, { foreignKey: 'reportId' })
  declare report: BelongsTo<typeof MediaFile>

  @column()
  declare agenda: string

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
