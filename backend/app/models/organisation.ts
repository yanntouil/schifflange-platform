import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import OrganisationCategory, {
  preloadOrganisationCategory,
  preloadPublicOrganisationCategory,
} from '#models/organisation-category'
import OrganisationTranslation from '#models/organisation-translation'
import User, { withProfile } from '#models/user'
import { type ExtraField } from '#models/user-profile'
import FileService, { type SingleImage } from '#services/files/file'
import { columnJSON } from '#utils/column-json'
import {
  filterOrganisationsByValidator,
  sortOrganisationsByValidator,
} from '#validators/organisations'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import { QueryScopeCallback } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  HasManyQueryBuilderContract,
  ManyToMany,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G, O } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import ContactOrganisation from './contact-organisation.js'

/**
 * Model for Organisation (CMS)
 * organisation represents a hierarchical entity (commune, service, association, etc.)
 */
type Model = Organisation
export default class Organisation extends ExtendedModel {
  public static table = 'organisations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare workspaceId: string

  // translations of the organisation
  @hasMany(() => OrganisationTranslation)
  declare translations: HasMany<typeof OrganisationTranslation>

  @column()
  declare type: OrganisationType

  @column()
  declare pin: boolean

  @column()
  declare pinOrder: number

  // hierarchical relationship
  @column()
  declare parentOrganisationId: string | null
  @belongsTo(() => Organisation, { foreignKey: 'parentOrganisationId' })
  declare parentOrganisation: BelongsTo<typeof Organisation>

  @hasMany(() => Organisation, {
    foreignKey: 'parentOrganisationId',
  })
  declare childOrganisations: HasMany<typeof Organisation>

  // categories relationship
  @manyToMany(() => OrganisationCategory, {
    localKey: 'id',
    pivotForeignKey: 'organisation_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'category_id',
    pivotTable: 'organisations_categories',
  })
  declare categories: ManyToMany<typeof OrganisationCategory>

  @hasMany(() => ContactOrganisation)
  declare contactOrganisations: HasMany<typeof ContactOrganisation>

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare logoImage: SingleImage

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare cardImage: SingleImage

  @column(columnJSON<ExtraField[]>([]))
  declare phones: ExtraField[]

  @column(columnJSON<ExtraField[]>([]))
  declare emails: ExtraField[]

  @column(columnJSON<ExtraField[]>([]))
  declare extras: ExtraField[]

  @column(columnJSON<OrganisationAddress[]>([]))
  declare addresses: OrganisationAddress[]

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
    ressource.parentOrganisationId ??= null
    ressource.type ??= organisationDefaultType
    ressource.pin ??= false
    ressource.pinOrder ??= 0
    ressource.logoImage ??= FileService.emptyImage
    ressource.cardImage ??= FileService.emptyImage
    ressource.phones ??= []
    ressource.emails ??= []
    ressource.extras ??= []
    ressource.addresses ??= []
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
   * COMPUTED
   */
  @computed()
  public get contactCount() {
    return this.$extras?.contactCount ?? 0
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope<typeof Organisation, QueryScopeCallback<typeof Organisation>>(
    (query, filterBy: Infer<typeof filterOrganisationsByValidator>) => {
      if (D.isEmpty(filterBy)) return query
      const { categories, types, pinned } = filterBy
      if (G.isNotNullable(categories) && A.isNotEmpty(categories)) {
        query.whereHas('categories', (categoryQuery) => {
          categoryQuery.whereIn('id', categories)
        })
      }
      if (G.isNotNullable(types) && A.isNotEmpty(types)) {
        query.whereIn('type', types)
      }
      if (G.isNotNullable(pinned)) {
        query.where('pin', pinned)
      }
    }
  )

  public static sortBy = scope<typeof Organisation, QueryScopeCallback<typeof Organisation>>(
    (query, sortBy: Infer<typeof sortOrganisationsByValidator>) => {
      const { field = 'createdAt', direction = 'desc' } = sortBy
      return query.orderBy(field, direction)
    }
  )

  public static limit = scope<typeof Organisation, QueryScopeCallback<typeof Organisation>>(
    (query, limit: number | undefined) => {
      if (G.isNullable(limit)) return query
      return query.limit(limit)
    }
  )

  public static pinned = scope<typeof Organisation, QueryScopeCallback<typeof Organisation>>(
    (query) => {
      return query.where('pin', true).orderBy('pin_order', 'asc')
    }
  )

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language): any {
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
      parentOrganisation: this.parentOrganisation?.publicSerialize(language),
      categories: A.map(this.categories ?? [], (category) => category.publicSerialize(language)),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public static async inTree(organisations?: Organisation[]) {
    return populateTree(null, organisations ?? (await Organisation.all()))
  }

  public async isParentOf(id: string, allOrganisations?: Organisation[]) {
    allOrganisations ??= await Organisation.all()
    return isInTree(id, populateTree(this.id, allOrganisations))
  }

  public async isChildOf(id: string, allOrganisations?: Organisation[]) {
    const all = allOrganisations ?? (await Organisation.all())
    return isInTree(this.id, populateTree(id, all))
  }

  public async cleanup() {
    await Promise.all(
      A.map(await this.getOrLoadRelation('translations'), (translation) => translation.cleanup())
    )
    await this.deleteLogoImage()
    await this.deleteCardImage()
  }

  public async deleteLogoImage() {
    this.logoImage = await FileService.deleteImage(this.logoImage)
    return this.logoImage
  }

  public async createLogoImage(file: any) {
    this.logoImage = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
      thumbnailSize: [400],
    })
    return this.logoImage
  }

  public async deleteCardImage() {
    this.cardImage = await FileService.deleteImage(this.cardImage)
    return this.cardImage
  }

  public async createCardImage(file: any) {
    this.cardImage = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
      thumbnailSize: [400],
    })
    return this.cardImage
  }

  public makePath() {
    return `workspaces/${this.workspaceId}/organisations/${this.id}`
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
 * helpers
 */
const populateTree = (id: string | null, organisations: Organisation[]): OrganisationTree =>
  A.filterMap(organisations, (org) =>
    org.parentOrganisationId === id
      ? {
          id: org.id,
          parentOrganisationId: id,
          children: populateTree(org.id, organisations),
        }
      : O.None
  )

const isInTree = (id: string, tree: OrganisationTree): boolean =>
  A.some(tree, (org) =>
    org.id === id ? true : A.isNotEmpty(org.children) ? isInTree(id, org.children) : false
  )

/**
 * utils
 */
export function makeOrganisationAddress(
  data: Partial<OrganisationAddress> = {}
): OrganisationAddress {
  return {
    type: data.type ?? 'physical',
    street: data.street ?? '',
    postalCode: data.postalCode ?? '',
    city: data.city ?? '',
    country: data.country ?? '',
    label: data.label ?? '',
  }
}

/**
 * constants and types
 */
export const organisationTypes = [
  'municipality',
  'service',
  'association',
  'commission',
  'company',
  'other',
] as const
export type OrganisationType = (typeof organisationTypes)[number]
export const organisationDefaultType = organisationTypes[0]

export type OrganisationAddress = {
  type: 'physical' | 'postal'
  street: string
  postalCode: string
  city: string
  country: string
  label: string
}

type OrganisationTree = {
  id: string
  parentOrganisationId: string | null
  children: OrganisationTree
}[]

/**
 * preloaders
 */
export const preloadOrganisation = (query: HasManyQueryBuilderContract<typeof Organisation, any>) =>
  query
    .preload('categories', preloadOrganisationCategory)
    .preload('translations')
    .preload('parentOrganisation', preloadOrganisation)
    .preload('createdBy', withProfile)
    .preload('updatedBy', withProfile)
export const withChildOrganisations = [
  'childOrganisations',
  (query: HasManyQueryBuilderContract<typeof Organisation, any>) =>
    query
      .withCount('contactOrganisations', (query) => query.as('contactCount'))
      .preload('categories', preloadOrganisationCategory)
      .preload('translations')
      .preload('parentOrganisation', preloadOrganisation)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile),
] as const
export const preloadPublicOrganisation = (query: PreloaderContract<Organisation>) =>
  query
    .preload('translations')
    .preload('parentOrganisation', (query) => query.preload('translations'))
    .preload('categories', preloadPublicOrganisationCategory)
