import ExtendedModel from '#models/extended/extended-model'
import LanguagesProvider from '#providers/languages_provider'
import { beforeCreate, beforeDelete, column, computed } from '@adonisjs/lucid/orm'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { A, D, G, O } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'

/**
 * Model Language
 */
type Model = Language
export default class Language extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string
  @column()
  declare code: string
  @column()
  declare locale: string

  @column({ serialize: (value) => !!value })
  declare default: boolean

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTED
   */

  @computed()
  get isDefault() {
    return !!this.default
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(ressource: Model) {
    ressource.default ??= false
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * STATIC
   */

  public static fromRequest() {
    return LanguagesProvider.current()
  }

  public static findIn<T extends { languageId: string }>(ressources: T[]) {
    try {
      return A.find(ressources, ({ languageId }) => languageId === Language.fromRequest().id)
    } catch (error) {
      return O.None
    }
  }

  public static getOrDefault(language: Option<string>) {
    return LanguagesProvider.getOrDefault(language)
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // clean relations dependencies
    return Promise.all([])
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }
}
