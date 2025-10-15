import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile from '#models/media-file'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { D } from '@mobily/ts-belt'

/**
 *  translatable fields in File
 */
type Model = MediaFileTranslation
export default class MediaFileTranslation extends ExtendedModel {
  public static table = 'media_file_translations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column()
  declare languageId: string
  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare fileId: string
  @belongsTo(() => MediaFile, { foreignKey: 'fileId' })
  declare file: BelongsTo<typeof MediaFile>

  @column()
  declare name: string
  @column()
  declare alt: string
  @column()
  declare caption: string

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    language // unused
    return D.deleteKeys(this.serialize(), ['languageId', 'fileId'])
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(ressource: Model) {
    ressource.name ??= ''
    ressource.alt ??= ''
    ressource.caption ??= ''
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */
}
