import ExtendedModel from '#models/extended/extended-model'
import LibraryDocument, { withDocumentCount } from '#models/library-document'
import LibraryTranslation, { withLibraryTranslations } from '#models/library-translation'
import User, { withCreatedBy, withUpdatedBy } from '#models/user'
import Workspace from '#models/workspace'
import { filterLibrariesByValidator, sortLibrariesByValidator } from '#validators/libraries'
import {
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
import { QueryScopeCallback } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  HasMany,
  HasManyQueryBuilderContract,
  PreloaderContract,
  RelationSubQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { A, D, G, O } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import Language from './language.js'

/**
 * Model Language
 */
type Model = Library
export default class Library extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @hasMany(() => LibraryTranslation, { foreignKey: 'libraryId' })
  declare translations: HasMany<typeof LibraryTranslation>

  @hasMany(() => LibraryDocument, { foreignKey: 'libraryId' })
  declare documents: HasMany<typeof LibraryDocument>

  @column()
  declare pin: boolean

  @column()
  declare pinOrder: number

  // hierarchical relationship
  @column()
  declare parentLibraryId: string | null
  @belongsTo(() => Library, { foreignKey: 'parentLibraryId' })
  declare parentLibrary: BelongsTo<typeof Library>

  @hasMany(() => Library, {
    foreignKey: 'parentLibraryId',
  })
  declare childLibraries: HasMany<typeof Library>

  @column({ serializeAs: null })
  declare workspaceId: string | null
  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

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
    ressource.parentLibraryId ??= null
    ressource.pin ??= false
    ressource.pinOrder ??= 0
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTED
   */

  @computed()
  public get documentCount(): number {
    return this.$extras?.documentCount ?? this.documents?.length ?? 0
  }
  @computed()
  public get childLibraryCount(): number {
    return this.$extras?.childLibraryCount ?? this.childLibraries?.length ?? 0
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope<typeof Library, QueryScopeCallback<typeof Library>>(
    (query, filterBy: Infer<typeof filterLibrariesByValidator>) => {
      if (D.isEmpty(filterBy)) return query
      const { pinned } = filterBy
      if (G.isNotNullable(pinned)) {
        query.where('pin', pinned)
      }
    }
  )

  public static sortBy = scope<typeof Library, QueryScopeCallback<typeof Library>>(
    (query, sortBy: Infer<typeof sortLibrariesByValidator>) => {
      const { field = 'createdAt', direction = 'desc' } = sortBy
      return query.orderBy(field, direction)
    }
  )

  public static limit = scope<typeof Library, QueryScopeCallback<typeof Library>>(
    (query, limit: number | undefined) => {
      if (G.isNullable(limit)) return query
      return query.limit(limit)
    }
  )

  public static pinned = scope<typeof Library, QueryScopeCallback<typeof Library>>((query) => {
    return query.where('pin', true).orderBy('pin_order', 'asc')
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public serializeWithDocuments() {
    return {
      ...this.serialize(),
      documents: A.map(this.documents ?? [], (document) => document.serializeWithFiles()),
    }
  }

  public publicSerialize(_language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), ['updatedById', 'updatedBy', 'updatedAt']),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public static async inTree(libraries?: Library[]) {
    return populateTree(null, libraries ?? (await Library.all()))
  }

  public async isParentOf(id: string, allLibraries?: Library[]) {
    allLibraries ??= await Library.all()
    return isInTree(id, populateTree(this.id, allLibraries))
  }

  public async isChildOf(id: string, allLibraries?: Library[]) {
    const all = allLibraries ?? (await Library.all())
    return isInTree(this.id, populateTree(id, all))
  }

  public async cleanup() {
    // clean relations dependencies
    await Promise.all([
      ...A.map(await this.getOrLoadRelation('translations'), (translation) =>
        translation.cleanup()
      ),
      ...A.map(await this.getOrLoadRelation('documents'), (document) => document.cleanup()),
    ])
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
const populateTree = (id: string | null, libraries: Library[]): LibraryTree =>
  A.filterMap(libraries, (lib) =>
    lib.parentLibraryId === id
      ? {
          id: lib.id,
          parentLibraryId: id,
          children: populateTree(lib.id, libraries),
        }
      : O.None
  )

const isInTree = (id: string, tree: LibraryTree): boolean =>
  A.some(tree, (lib) =>
    lib.id === id ? true : A.isNotEmpty(lib.children) ? isInTree(id, lib.children) : false
  )

/**
 * constants and types
 */
type LibraryTree = {
  id: string
  parentLibraryId: string | null
  children: LibraryTree
}[]

/**
 * preloaders
 */
export const preloadLibrary = (query: PreloaderContract<Library>) =>
  query
    .preload(...withLibraryTranslations())
    .preload(...withParentLibrary())
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())

export const withParentLibrary = () => ['parentLibrary', preloadLibrary] as const
export const withLibrary = () => ['library', preloadLibrary] as const
export const withChildLibraryCount = () =>
  [
    'childLibraries',
    (query: RelationSubQueryBuilderContract<typeof Library>) => query.as('childLibraryCount'),
  ] as const

export const withChildLibraries = () =>
  [
    'childLibraries',
    (query: HasManyQueryBuilderContract<typeof Library, any>) =>
      query
        .preload(...withLibraryTranslations())
        .preload(...withParentLibrary())
        .withCount(...withDocumentCount())
        .withCount(...withChildLibraryCount())
        .preload(...withCreatedBy())
        .preload(...withUpdatedBy()),
  ] as const
