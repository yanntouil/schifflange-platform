import ExtendedModel from '#models/extended/extended-model'
import Trace from '#models/trace'
import Workspace from '#models/workspace'
import { beforeDelete, belongsTo, column, computed, hasMany, scope } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
  RelationQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'

/**
 * Model Tracking
 */
type Model = Tracking
export default class Tracking extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: TrackingType

  @column()
  declare model: string

  @hasMany(() => Trace, { foreignKey: 'trackingId' })
  declare traces: HasMany<typeof Trace>

  @column()
  declare workspaceId: string | null
  @belongsTo(() => Workspace)
  declare workspace: BelongsTo<typeof Workspace>

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

  public static whereHas = scope((query, type?: string, model?: string) => {
    const typeQuery = type && A.includes([...trackingType], type) ? type : null
    const modelQuery = model ?? null
    if (modelQuery && typeQuery)
      return query.where((query) => query.where('type', typeQuery).andWhere('model', modelQuery))
    if (typeQuery) return query.where((query) => query.where('type', typeQuery))
    if (modelQuery) return query.where((query) => query.where('model', modelQuery))
    return query
  })
  public static whereIn = scope((query, ids?: string[]) => {
    if (ids) return query.whereIn('id', ids)
    return query
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTEDS
   */

  @computed()
  public get visits() {
    return this.$extras.visits
  }

  @computed()
  public get clicks() {
    return this.$extras.clicks
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Trace.query().where('trackingId', this.id).delete()
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
 * types
 */
export const trackingType = ['views', 'clicks'] as const
export const trackingTypeDefault = trackingType[0]
export type TrackingType = (typeof trackingType)[number]

/**
 * preloaders
 */
export const preloadTracking = (query: PreloaderContract<Tracking>) => query
export const withTracking = () => ['tracking', preloadTracking] as const
export const preloadVisits = (query: RelationQueryBuilderContract<typeof Tracking, any>) =>
  query.withCount('traces', (query) => query.as('visits'))
export const withVisits = () => ['tracking', preloadVisits] as const
export const preloadClicks = (query: RelationQueryBuilderContract<typeof Tracking, any>) =>
  query.withCount('traces', (query) => query.as('clicks'))
export const withClicks = () => ['tracking', preloadClicks] as const
