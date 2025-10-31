import ContactOrganisation from '#models/contact-organisation'
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
 * Model for ContactOrganisation Translation (CMS)
 * contact organisation translation is a translation part of a contact organisation relationship
 */
type Model = ContactOrganisationTranslation
export default class ContactOrganisationTranslation extends ExtendedModel {
  public static table = 'contact_organisation_translations'

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
  declare contactOrganisationId: string
  @belongsTo(() => ContactOrganisation, {
    foreignKey: 'contactOrganisationId',
    serializeAs: null,
  })
  declare contactOrganisation: BelongsTo<typeof ContactOrganisation>

  @column()
  declare role: string

  @column()
  declare roleDescription: string

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static beforeCreateHook(ressource: Model) {
    ressource.role ??= ''
    ressource.roleDescription ??= ''
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
    return D.deleteKeys(this.serialize(), ['languageId', 'contactOrganisationId'])
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
export const preloadContactOrganisationTranslation = (
  query: PreloaderContract<ContactOrganisationTranslation>
) => query
export const withContactOrganisationTranslations = () =>
  ['translations', preloadContactOrganisationTranslation] as const
