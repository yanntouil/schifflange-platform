import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'

/**
 * Model for Organisation Category Translation (CMS)
 * organisation category translation is a translation part of an organisation category
 */
type Model = OrganisationCategoryTranslation
export default class OrganisationCategoryTranslation extends ExtendedModel {
  public static table = 'organisation_category_translations'

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

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static beforeCreateHook(ressource: Model) {
    ressource.title ??= ''
    ressource.description ??= ''
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
    return this.serialize()
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
export const preloadOrganisationCategoryTranslation = (
  query: PreloaderContract<OrganisationCategoryTranslation>
) => query
export const withOrganisationCategoryTranslations = () =>
  ['translations', preloadOrganisationCategoryTranslation] as const
