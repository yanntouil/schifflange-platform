import Contact, { preloadContact } from '#models/contact'
import ContactOrganisationTranslation from '#models/contact-organisation-translation'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import Organisation, { preloadOrganisation } from '#models/organisation'
import User, { withProfile } from '#models/user'
import { type ExtraField } from '#models/user-profile'
import { columnJSON } from '#utils/column-json'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for ContactOrganisation (CMS)
 * contact organisation represents the relationship between a contact and an organisation with metadata
 */
type Model = ContactOrganisation
export default class ContactOrganisation extends ExtendedModel {
  public static table = 'contact_organisations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  // translations of the contact organisation relationship
  @hasMany(() => ContactOrganisationTranslation)
  declare translations: HasMany<typeof ContactOrganisationTranslation>

  @column()
  declare contactId: string
  @belongsTo(() => Contact, { foreignKey: 'contactId' })
  declare contact: BelongsTo<typeof Contact>

  @column()
  declare organisationId: string
  @belongsTo(() => Organisation, { foreignKey: 'organisationId' })
  declare organisation: BelongsTo<typeof Organisation>

  @column(columnJSON<ExtraField[]>([]))
  declare phones: ExtraField[]

  @column(columnJSON<ExtraField[]>([]))
  declare emails: ExtraField[]

  @column(columnJSON<ExtraField[]>([]))
  declare extras: ExtraField[]

  @column({ serialize: (value) => !!value })
  declare isPrimary: boolean

  @column({ serialize: (value) => !!value })
  declare isResponsible: boolean

  @column()
  declare order: number

  @column.date()
  declare startDate: DateTime | null

  @column.date()
  declare endDate: DateTime | null

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
    ressource.phones ??= []
    ressource.emails ??= []
    ressource.extras ??= []
    ressource.isPrimary ??= false
    ressource.isResponsible ??= false
    ressource.order ??= 0
    ressource.startDate ??= null
    ressource.endDate ??= null
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
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'updatedById',
        'updatedBy',
        'updatedAt',
        'createdById',
        'createdBy',
        'createdAt',
      ]),
      translations: A.find(
        this.translations,
        (translation) => translation.languageId === language.id
      )?.publicSerialize(language),
      contact: this.contact?.publicSerialize(language),
      organisation: this.organisation?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(await this.getOrLoadRelation('translations'), (translation) => translation.cleanup())
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
export const preloadContactOrganisation = (query: PreloaderContract<ContactOrganisation>) =>
  query
    .preload('translations')
    .preload('organisation', preloadOrganisation)
    .preload('createdBy', withProfile)
    .preload('updatedBy', withProfile)
export const preloadOrganisationContact = (query: PreloaderContract<ContactOrganisation>) =>
  query
    .preload('translations')
    .preload('contact', preloadContact)
    .preload('createdBy', withProfile)
    .preload('updatedBy', withProfile)

export const preloadPublicContactOrganisation = (query: PreloaderContract<ContactOrganisation>) =>
  query.preload('translations').preload('contact').preload('organisation')
