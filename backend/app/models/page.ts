import Content from '#models/content'
import ExtendedModel from '#models/extended/extended-model'
import Seo, { withSeo } from '#models/seo'
import Slug from '#models/slug'
import Tracking from '#models/tracking'
import User from '#models/user'
import { afterCreate, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  PreloaderContract,
  RelationQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'
import Language from './language.js'

/**
 * Model for Page (CMS)
 * page is a cms container for a page
 */
type Model = Page
export default class Page extends ExtendedModel {
  public static table = 'pages'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare seoId: string
  @belongsTo(() => Seo, { foreignKey: 'seoId' })
  declare seo: BelongsTo<typeof Seo>

  @column({ serializeAs: null })
  declare contentId: string
  @belongsTo(() => Content, { foreignKey: 'contentId' })
  declare content: BelongsTo<typeof Content>

  @column()
  declare trackingId: string
  @belongsTo(() => Tracking, { foreignKey: 'trackingId' })
  declare tracking: BelongsTo<typeof Tracking>

  @column()
  declare slugId: string
  @belongsTo(() => Slug, { foreignKey: 'slugId' })
  declare slug: BelongsTo<typeof Slug>

  @column({ serialize: (value) => !!value })
  declare lock: boolean

  @column()
  declare state: PageState

  @column({ serializeAs: null })
  declare workspaceId: string | null

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
    const [seo, content, tracking, slug] = await Promise.all([
      Seo.create({}, { client }),
      Content.create({}, { client }),
      Tracking.create(
        { type: 'views', model: 'page', workspaceId: ressource.workspaceId },
        { client }
      ),
      Slug.create({ model: 'page', workspaceId: ressource.workspaceId }, { client }),
    ])
    ressource.seoId = seo.id
    ressource.contentId = content.id
    ressource.trackingId = tracking.id
    ressource.slugId = slug.id
    ressource.state ??= pageDefaultState
    ressource.lock ??= false
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const slug = await ressource.getOrLoadRelation('slug')
    slug?.merge({ slug: ressource.id, path: ressource.id }).save()
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'state',
        'lock',
        'slugId',
        'updatedById',
        'updatedBy',
        'updatedAt',
        'createdById',
        'createdBy',
        'createdAt',
      ]),
      trackingId: this.trackingId,
      seo: this.seo?.publicSerialize(language),
      content: this.content?.publicSerialize(language),
      slug: this.slug?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(['seo', 'content', 'tracking', 'slug'] as const, async (related) => {
        const relation = await this.getOrLoadRelation(related)
        await relation.cleanup()
        await relation.delete()
      })
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
 * constants and types related to pages
 */
export const pageStates = ['draft', 'published'] as const
export type PageState = (typeof pageStates)[number]
export const pageDefaultState = pageStates[0]

/**
 * serializer, preloader and query builder
 */
export const preloadVisits = (query: RelationQueryBuilderContract<typeof Tracking, any>) =>
  query.withCount('traces', (query) => query.as('visits'))

export const withSoftPage = () =>
  ['page', (query: PreloaderContract<Page>) => query.preload(...withSeo())] as const
