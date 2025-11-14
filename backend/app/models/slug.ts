import Article from '#models/article'
import Event from '#models/event'
import ExtendedModel from '#models/extended/extended-model'
import Forward from '#models/forward'
import Language from '#models/language'
import Page from '#models/page'
import { withSeo } from '#models/seo'
import { beforeCreate, beforeDelete, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { ExtractModelRelations, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { withPublicPublication } from './publication.js'

/**
 * Model for Slug (router)
 * slug is a container for a each collection with a routing system
 */
type Model = Slug
export default class Slug extends ExtendedModel {
  public static table = 'slugs'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare slug: string

  @column()
  declare path: string

  @column()
  declare model: 'page' | 'article' | 'event'

  @column({ serializeAs: null })
  declare workspaceId: string | null

  @hasMany(() => Forward, { foreignKey: 'slugId' })
  declare forwards: HasMany<typeof Forward>

  @hasOne(() => Page, { foreignKey: 'slugId' })
  declare page: HasOne<typeof Page>
  @hasOne(() => Article, { foreignKey: 'slugId' })
  declare article: HasOne<typeof Article>
  @hasOne(() => Event, { foreignKey: 'slugId' })
  declare event: HasOne<typeof Event>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(ressource: Model) {
    ressource.slug ??= ''
    ressource.path ??= ''
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language): Record<string, unknown> {
    return {
      ...D.deleteKeys(this.serialize(), ['slug']),
      page: this.page?.publicSerialize(language),
      article: this.article?.publicSerialize(language),
      event: this.event?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all([
      ...A.map(await this.getOrLoadRelation('forwards'), async (forward) => forward.cleanup()),
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

export const preloadSlug = (query: ModelQueryBuilderContract<typeof Slug>) => {
  query
    .preload('page', (query) => query.preload(...withSeo()))
    .preload('article', (query) => query.preload(...withSeo()).preload(...withPublicPublication()))
    .preload('event', (query) => query.preload(...withSeo()).preload(...withPublicPublication()))
}
export const withSlug = () => ['slug', preloadSlug] as const
export const withSlugs = () => ['slugs', preloadSlug] as const
