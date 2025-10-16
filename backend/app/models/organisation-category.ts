import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import Organisation, { organisationDefaultType, type OrganisationType } from '#models/organisation'
import OrganisationCategoryTranslation from '#models/organisation-category-translation'
import User, { withProfile } from '#models/user'
import Workspace from '#models/workspace'
import FileService, { type SingleImage } from '#services/files/file'
import { columnJSON } from '#utils/column-json'
import {
  filterOrganisationCategoriesByValidator,
  sortOrganisationCategoriesByValidator,
} from '#validators/organisation-categories'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
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
 * Model for Organisation Category (CMS)
 * organisation category is a category for organisations
 */
type Model = OrganisationCategory
export default class OrganisationCategory extends ExtendedModel {
  public static table = 'organisation_categories'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare workspaceId: string
  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

  @column()
  declare type: OrganisationType

  @column()
  declare order: number

  @column(columnJSON<SingleImage>(FileService.emptyImage, FileService.serializeImage))
  declare image: SingleImage

  @hasMany(() => OrganisationCategoryTranslation, {
    foreignKey: 'categoryId',
  })
  declare translations: HasMany<typeof OrganisationCategoryTranslation>

  @hasMany(() => Organisation, { foreignKey: 'categoryId' })
  declare organisations: HasMany<typeof Organisation>

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
    ressource.type ??= organisationDefaultType
    ressource.order ??= 0
    ressource.image ??= FileService.emptyImage
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
   * COMPUTEDS
   */

  @computed()
  public get totalOrganisations() {
    return this.$extras?.totalOrganisations
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope(
    (query, filterBy: Infer<typeof filterOrganisationCategoriesByValidator>) => {
      if (D.isEmpty(filterBy)) return query
      // const {  } = filterBy
    }
  )

  public static sortBy = scope(
    (query, sortBy: Infer<typeof sortOrganisationCategoriesByValidator>) => {
      const { field = 'createdAt', direction = 'desc' } = sortBy
      return query.orderBy(field, direction)
    }
  )

  public static limit = scope((query, limit: number | undefined) => {
    if (G.isNullable(limit)) return query
    return query.limit(limit)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'createdById',
        'createdBy',
        'createdAt',
        'updatedById',
        'updatedBy',
        'updatedAt',
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
    await this.deleteImage()
  }

  public async deleteImage() {
    this.image = await FileService.deleteImage(this.image)
    return this.image
  }

  public async createImage(file: MultipartFile) {
    this.image = await FileService.makeImage(file, {
      folder: this.makePath(),
      previewSize: [1080],
      thumbnailSize: [400],
    })
    return this.image
  }

  public makePath() {
    return `workspaces/${this.workspaceId}/organisation-categories/${this.id}`
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
export const preloadOrganisationCategory = (query: PreloaderContract<OrganisationCategory>) =>
  query.preload('translations').preload('createdBy', withProfile).preload('updatedBy', withProfile)

export const preloadPublicOrganisationCategory = (query: PreloaderContract<OrganisationCategory>) =>
  query.preload('translations')
