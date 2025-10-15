import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import User, { withProfile } from '#models/user'
import { beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  PreloaderContract,
} from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for Publication (CMS)
 * publication is a cms container for a collection of content items
 */
type Model = Publication
export default class Publication extends ExtendedModel {
  public static table = 'publications'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime()
  declare publishedFrom: DateTime | null

  @column.dateTime()
  declare publishedTo: DateTime | null

  @column({ serializeAs: null })
  declare publishedById: string | null
  @belongsTo(() => User, { foreignKey: 'publishedById' })
  declare publishedBy: BelongsTo<typeof User>

  @column({ serializeAs: null })
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
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    language // unused
    return {
      ...D.deleteKeys(this.serialize(), [
        'id',
        'updatedById',
        'updatedBy',
        'updatedAt',
        'publishedFrom',
        'publishedTo',
        'publishedById',
      ]),
      publishedBy: this.publishedBy?.publicSerialize(language),
    }
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

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * STATIC
   */

  public static parseInterval(
    valid: {
      publishedFrom?: Date | null
      publishedTo?: Date | null
    },
    fallback: {
      publishedFrom: DateTime | null
      publishedTo: DateTime | null
    }
  ) {
    // Convert the Date (from front) to DateTime (Luxon) if defined
    const publishedFrom = G.isUndefined(valid.publishedFrom)
      ? fallback.publishedFrom
      : G.isNullable(valid.publishedFrom)
        ? null
        : DateTime.fromJSDate(valid.publishedFrom)
    const publishedTo = G.isUndefined(valid.publishedTo)
      ? fallback.publishedTo
      : G.isNullable(valid.publishedTo)
        ? null
        : DateTime.fromJSDate(valid.publishedTo)
    // If both dates are null or fallback values
    if (G.isNullable(publishedFrom) && G.isNullable(publishedTo))
      return { publishedFrom, publishedTo }
    // from date to ever OR from ever to date
    if ((publishedFrom && !publishedTo) || (!publishedFrom && publishedTo))
      return { publishedFrom, publishedTo }
    // from date to date
    if (publishedFrom && publishedTo && publishedFrom <= publishedTo)
      return { publishedFrom, publishedTo }
    // Return fallback if no valid dates
    return fallback
  }
}

/**
 * constants, types and helpers
 */
export const defaultInterval = { publishedFrom: null, publishedTo: null }

/**
 * serializer, preloader and query builder
 */
export const withPublicationRelation = (query: PreloaderContract<Publication>) =>
  query.preload('updatedBy', withProfile).preload('publishedBy', withProfile)
export const preloadPublicPublication = (query: PreloaderContract<Publication>) =>
  query.preload('updatedBy', withProfile).preload('publishedBy', withProfile)
