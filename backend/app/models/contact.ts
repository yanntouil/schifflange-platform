import ContactOrganisation from '#models/contact-organisation'
import ContactTranslation, { withContactTranslations } from '#models/contact-translation'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import User, { withCreatedBy, withUpdatedBy } from '#models/user'
import { type ExtraField } from '#models/user-profile'
import FileService, { type SingleImage } from '#services/files/file'
import { columnJSON } from '#utils/column-json'
import { filterContactsByValidator, sortContactsByValidator } from '#validators/contacts'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
import { QueryScopeCallback } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model for Contact (CMS)
 * contact represents a physical person with their contact information
 */
type Model = Contact
export default class Contact extends ExtendedModel {
  public static table = 'contacts'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare workspaceId: string

  // translations of the contact
  @hasMany(() => ContactTranslation)
  declare translations: HasMany<typeof ContactTranslation>

  @hasMany(() => ContactOrganisation)
  declare contactOrganisations: HasMany<typeof ContactOrganisation>

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare portraitImage: SingleImage

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare squareImage: SingleImage

  @column(columnJSON<ExtraField[]>([]))
  declare phones: ExtraField[]

  @column(columnJSON<ExtraField[]>([]))
  declare emails: ExtraField[]

  @column(columnJSON<ExtraField[]>([]))
  declare extras: ExtraField[]

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare politicalParty: string

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
    ressource.portraitImage ??= FileService.emptyImage
    ressource.squareImage ??= FileService.emptyImage
    ressource.phones ??= []
    ressource.emails ??= []
    ressource.extras ??= []
    ressource.firstName ??= ''
    ressource.lastName ??= ''
    ressource.politicalParty ??= ''
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
   * SCOPES
   */

  public static filterBy = scope<typeof Contact, QueryScopeCallback<typeof Contact>>(
    (query, filterBy: Infer<typeof filterContactsByValidator>) => {
      if (D.isEmpty(filterBy)) return query
      const { organisations } = filterBy
      if (G.isNotNullable(organisations) && A.isNotEmpty(organisations)) {
        query.whereHas('contactOrganisations', (query) => {
          query.whereIn('organisation_id', organisations)
        })
      }
    }
  )

  public static sortBy = scope<typeof Contact, QueryScopeCallback<typeof Contact>>(
    (query, sortBy: Infer<typeof sortContactsByValidator>) => {
      const { field = 'createdAt', direction = 'desc' } = sortBy
      return query.orderBy(field, direction)
    }
  )

  public static limit = scope<typeof Contact, QueryScopeCallback<typeof Contact>>(
    (query, limit: number | undefined) => {
      if (G.isNullable(limit)) return query
      return query.limit(limit)
    }
  )

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
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(await this.getOrLoadRelation('translations'), (translation) => translation.cleanup())
    )
    await this.deletePortraitImage()
    await this.deleteSquareImage()
  }

  public async deletePortraitImage() {
    this.portraitImage = await FileService.deleteImage(this.portraitImage)
    return this.portraitImage
  }

  public async createPortraitImage(file: any) {
    this.portraitImage = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
      thumbnailSize: [400],
    })
    return this.portraitImage
  }

  public async deleteSquareImage() {
    this.squareImage = await FileService.deleteImage(this.squareImage)
    return this.squareImage
  }

  public async createSquareImage(file: any) {
    this.squareImage = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080, 1080],
      thumbnailSize: [400, 400],
    })
    return this.squareImage
  }

  public makePath() {
    return `workspaces/${this.workspaceId}/contacts/${this.id}`
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
export const preloadContact = (query: PreloaderContract<Contact>) =>
  query
    .preload(...withContactTranslations())
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())

export const withContact = () => ['contact', preloadContact] as const
export const withContacts = () => ['contacts', preloadContact] as const

export const preloadPublicContact = (query: PreloaderContract<Contact>) =>
  query.preload('translations')
