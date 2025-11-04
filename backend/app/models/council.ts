import CouncilTranslation from '#models/council-translation'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MediaFile, { preloadFiles } from '#models/media-file'
import User from '#models/user'
import Workspace from '#models/workspace'
import { makeVideo, type Video } from '#services/video'
import { columnJSON } from '#utils/column-json'
import { filterCouncilsByValidator, sortCouncilsByValidator } from '#validators/councils'
import { beforeDelete, belongsTo, column, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  ManyToMany,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * Model for Council (CMS)
 * council is a cms container for a collection of councils
 */
type Model = Council
export default class Council extends ExtendedModel {
  public static table = 'councils'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime()
  declare date: DateTime

  @column(columnJSON<Video>(makeVideo()))
  declare video: Record<string, unknown>

  @hasMany(() => CouncilTranslation)
  declare translations: HasMany<typeof CouncilTranslation>

  // related files of the council
  @manyToMany(() => MediaFile, {
    localKey: 'id',
    pivotForeignKey: 'councils_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'file_id',
    pivotTable: 'councils_files',
  })
  declare files: ManyToMany<typeof MediaFile>

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

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filterBy: Infer<typeof filterCouncilsByValidator>) => {
    if (D.isEmpty(filterBy)) return query
    const { in: inIds } = filterBy
    if (G.isNotNullable(inIds)) query.andWhereIn('id', inIds)
    if (filterBy.dateFrom) query.andWhere('date', '>=', filterBy.dateFrom)
    if (filterBy.dateTo) query.andWhere('date', '<=', filterBy.dateTo)
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortCouncilsByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

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
        'updatedById',
        'updatedBy',
        'updatedAt',
        'createdById',
        'createdBy',
        'createdAt',
      ]),
      files: A.map(this.files ?? [], (file) => file.publicSerialize(language)),
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
    await Promise.all(A.map(await this.getOrLoadRelation('translations'), (item) => item.cleanup()))
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
 * Preloaders
 */
export const withCouncilTranslations = () =>
  ['translations', (query: any) => query.preload('report', preloadFiles)] as const
