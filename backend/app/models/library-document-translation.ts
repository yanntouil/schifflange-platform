import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, PreloaderContract } from '@adonisjs/lucid/types/relations'
import { D } from '@mobily/ts-belt'

/**
 *  translatable fields in Library
 */
type Model = LibraryDocumentTranslation
export default class LibraryDocumentTranslation extends ExtendedModel {
  public static table = 'library_document_translations'

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
  declare libraryDocumentId: string

  @column()
  declare title: string

  @column()
  declare description: string

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
    ressource.title ??= ''
    ressource.description ??= ''
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    //
  }
}

/**
 * preloaders
 */
export const preloadLibraryDocumentTranslation = (
  query: PreloaderContract<LibraryDocumentTranslation>
) => query
export const withLibraryDocumentTranslations = () =>
  ['translations', preloadLibraryDocumentTranslation] as const
