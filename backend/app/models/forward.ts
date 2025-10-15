import ExtendedModel from '#models/extended/extended-model'
import Slug from '#models/slug'
import { beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for Forward (router)
 * forward is a container for a each lost slug path
 */
type Model = Forward
export default class Forward extends ExtendedModel {
  public static table = 'forwards'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare path: string

  @column({ serializeAs: null })
  declare slugId: string | null
  @belongsTo(() => Slug, { foreignKey: 'slugId' })
  declare slug: BelongsTo<typeof Slug>

  @column({ serializeAs: null })
  declare workspaceId: string | null

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
