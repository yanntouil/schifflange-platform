import ExtendedModel from '#models/extended/extended-model'
import Library from '#models/library'
import LibraryDocumentTranslation, {
  withLibraryDocumentTranslations,
} from '#models/library-document-translation'
import MediaFile, { withFiles } from '#models/media-file'
import Publication, { withPublication } from '#models/publication'
import Tracking, { withVisits } from '#models/tracking'
import User, { withCreatedBy, withUpdatedBy } from '#models/user'
import Workspace from '#models/workspace'
import {
  filterLibraryDocumentsByValidator,
  sortLibraryDocumentsByValidator,
} from '#validators/library-documents'
import {
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
  HasMany,
  ManyToMany,
  RelationSubQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model Language
 */
type Model = LibraryDocument
export default class LibraryDocument extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare libraryId: string
  @belongsTo(() => Library, { foreignKey: 'libraryId' })
  declare library: BelongsTo<typeof Library>

  @column()
  declare reference: string

  @manyToMany(() => MediaFile, {
    localKey: 'id',
    pivotForeignKey: 'library_document_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'file_id',
    pivotTable: 'library_documents_files',
    pivotColumns: ['code'],
  })
  declare files: ManyToMany<typeof MediaFile>

  @hasMany(() => LibraryDocumentTranslation, { foreignKey: 'libraryDocumentId' })
  declare translations: HasMany<typeof LibraryDocumentTranslation>

  @column()
  declare publicationId: string | null
  @belongsTo(() => Publication, { foreignKey: 'publicationId' })
  declare publication: BelongsTo<typeof Publication>

  @column()
  declare trackingId: string
  @belongsTo(() => Tracking, { foreignKey: 'trackingId' })
  declare tracking: BelongsTo<typeof Tracking>

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
    const client = ressource.$trx
    const [publication, tracking] = await Promise.all([
      Publication.create({}, { client }),
      Tracking.create({
        type: 'views',
        model: 'library document',
        workspaceId: ressource.workspaceId,
      }, { client }),
    ])
    ressource.publicationId = publication.id
    ressource.trackingId = tracking.id
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTED
   */
  @computed()
  public get visits(): number {
    return this.$extras?.visits ?? 0
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope<
    typeof LibraryDocument,
    QueryScopeCallback<typeof LibraryDocument>
  >((query, filterBy: Infer<typeof filterLibraryDocumentsByValidator>) => {
    if (D.isEmpty(filterBy)) return query
    // Add filters here if needed
  })

  public static sortBy = scope<typeof LibraryDocument, QueryScopeCallback<typeof LibraryDocument>>(
    (query, sortBy: Infer<typeof sortLibraryDocumentsByValidator>) => {
      const { field = 'createdAt', direction = 'desc' } = sortBy
      return query.orderBy(field, direction)
    }
  )

  public static limit = scope<typeof LibraryDocument, QueryScopeCallback<typeof LibraryDocument>>(
    (query, limit: number | undefined) => {
      if (G.isNullable(limit)) return query
      return query.limit(limit)
    }
  )

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */
  public serializeWithFiles() {
    return {
      ...this.serialize(),
      files: A.map(this.files ?? [], (file) => ({
        ...file.serialize(),
        code: file.$extras?.pivot_code ?? '',
      })),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(['tracking', 'publication'] as const, async (related) =>
        (await this.getOrLoadRelation(related)).delete()
      )
    )
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
export const preloadLibraryDocument = (query: any) =>
  query
    .preload(...withLibraryDocumentTranslations())
    .preload(...withFiles())
    .preload(...withPublication())
    .preload(...withVisits())
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())
export const withLibraryDocument = () => ['document', preloadLibraryDocument] as const
export const withLibraryDocuments = () => ['documents', preloadLibraryDocument] as const
export const withDocumentCount = () =>
  [
    'documents',
    (query: RelationSubQueryBuilderContract<typeof LibraryDocument>) => query.as('documentCount'),
  ] as const
