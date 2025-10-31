import Content, { withContent } from '#models/content'
import EventCategory, { withEventCategories } from '#models/event-category'
import EventTranslation, { withEventTranslations } from '#models/event-translation'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import Publication, { withPublication } from '#models/publication'
import Schedule, { withSchedule } from '#models/schedule'
import Seo, { withSeo } from '#models/seo'
import Slug, { withSlug } from '#models/slug'
import Tracking, { withVisits } from '#models/tracking'
import User, { withCreatedBy, withUpdatedBy } from '#models/user'
import Workspace from '#models/workspace'
import { makeWorkspaceConfig } from '#models/workspace-config'
import { columnJSON } from '#utils/column-json'
import {
  filterEventsByValidator,
  sortEventsByValidator,
  updateEventCategoryValidator,
} from '#validators/events'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import { QueryScopeCallback } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  ManyToMany,
  PreloaderContract,
  RelationSubQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import { withEventCategoryTranslations } from './event-category-translation.js'

/**
 * Model for Event (Agenda)
 * Event is a cms container for an event
 */
type Model = Event
export default class Event extends ExtendedModel {
  public static table = 'events'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  // props of the event defined by the frontend
  @column(columnJSON<Record<string, unknown>>({}))
  declare props: Record<string, unknown>

  @column({ serializeAs: null })
  declare seoId: string
  @belongsTo(() => Seo, { foreignKey: 'seoId' })
  declare seo: BelongsTo<typeof Seo>

  @column({ serializeAs: null })
  declare contentId: string
  @belongsTo(() => Content, { foreignKey: 'contentId' })
  declare content: BelongsTo<typeof Content>

  @column({ serializeAs: null })
  declare scheduleId: string
  @belongsTo(() => Schedule, { foreignKey: 'scheduleId' })
  declare schedule: BelongsTo<typeof Schedule>

  @column()
  declare publicationId: string | null
  @belongsTo(() => Publication, { foreignKey: 'publicationId' })
  declare publication: BelongsTo<typeof Publication>

  @column()
  declare trackingId: string
  @belongsTo(() => Tracking, { foreignKey: 'trackingId' })
  declare tracking: BelongsTo<typeof Tracking>

  @column()
  declare slugId: string
  @belongsTo(() => Slug, { foreignKey: 'slugId' })
  declare slug: BelongsTo<typeof Slug>

  @manyToMany(() => EventCategory, {
    pivotTable: 'events_event_categories',
    localKey: 'id',
    pivotForeignKey: 'event_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'category_id',
  })
  declare categories: ManyToMany<typeof EventCategory>

  @column()
  declare state: EventState

  @hasMany(() => EventTranslation, { foreignKey: 'eventId' })
  declare translations: HasMany<typeof EventTranslation>

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
    const [seo, content, publication, schedule, tracking, slug] = await Promise.all([
      Seo.create({}, { client }),
      Content.create({}, { client }),
      Publication.create({}, { client }),
      Schedule.create({}, { client }),
      Tracking.create(
        { type: 'views', model: 'event', workspaceId: ressource.workspaceId },
        { client }
      ),
      Slug.create({ model: 'event', workspaceId: ressource.workspaceId }, { client }),
    ])

    ressource.seoId = seo.id
    ressource.contentId = content.id
    ressource.publicationId = publication.id
    ressource.scheduleId = schedule.id
    ressource.trackingId = tracking.id
    ressource.slugId = slug.id
    ressource.state ??= eventDefaultState
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const slug = await ressource.related('slug').query().first()
    const workspace = await ressource.related('workspace').query().first()
    if (G.isNullable(slug) || G.isNullable(workspace)) return
    const prefix = workspace.config.events?.slugPrefix ?? makeWorkspaceConfig().events.slugPrefix
    await slug
      .merge({ slug: `${prefix}/${ressource.id}`, path: `${prefix}/${ressource.id}` })
      .save()
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope<typeof Event, QueryScopeCallback<typeof Event>>(
    (query, filterBy: Infer<typeof filterEventsByValidator>) => {
      if (D.isEmpty(filterBy)) return query
      const { categories, in: inIds, isPublished } = filterBy
      if (G.isNotNullable(categories)) {
        query.whereHas('categories', (query) => query.whereIn('event_categories.id', categories))
      }
      if (G.isNotNullable(inIds)) query.andWhereIn('id', inIds)
      if (G.isNotNullable(isPublished)) query.andWhere('state', isPublished ? 'published' : 'draft')
    }
  )

  public static sortBy = scope((query, sortBy: Infer<typeof sortEventsByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: string | undefined, language: Language) => {
    if (G.isNullable(search) || search.trim() === '') return query
    language // Future: search in translations
    return query
    // return query.whereHas('translations', (query) =>
    //   query
    //     .where('name', 'like', `%${search}%`)
    //     .orWhere('description', 'like', `%${search}%`)
    //     .orWhere('location', 'like', `%${search}%`)
    // )
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
        'seoId',
        'contentId',
        'slugId',
        'workspaceId',
        'createdById',
        'updatedById',
      ]),
      translations: A.find(
        this.translations ?? [],
        (t) => t.languageId === language.id
      )?.publicSerialize(language),
      seo: this.seo?.publicSerialize(language),
      content: this.content?.publicSerialize(language),
      categories: A.map(this.categories ?? [], (category) => category.publicSerialize(language)),
      slug: this.slug?.publicSerialize(language),
      trackingId: this.trackingId,
      schedule: this.schedule?.publicSerialize(language),
      createdBy: this.createdBy?.publicSerialize(language),
      updatedBy: this.updatedBy?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // Delete all related entities
    await Promise.all(
      A.map(
        ['seo', 'content', 'schedule', 'publication', 'tracking', 'slug'] as const,
        async (related) => (await this.getOrLoadRelation(related)).delete()
      )
    )
    // Delete hasMany relations
    await Promise.all([
      ...(await this.getOrLoadRelation('translations')).map((translation) => translation.delete()),
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
 * constants and types related to events
 */
export const eventStates = ['draft', 'published'] as const
export type EventState = (typeof eventStates)[number]
export const eventDefaultState = eventStates[0]

/**
 * Preloaders
 */
export const preloadEvent = (query: PreloaderContract<Event>) =>
  query
    .preload(...withSeo())
    .preload(...withContent())
    .preload(...withEventCategories())
    .preload(...withSlug())
    .preload(...withVisits())
    .preload(...withEventTranslations())
    .preload(...withSchedule())
    .preload(...withPublication())
    .preload(...withCreatedBy())
    .preload(...withUpdatedBy())
export const withEvent = () => ['event', preloadEvent] as const
export const withSoftEvent = () =>
  ['event', (query: PreloaderContract<Event>) => query.preload(...withSeo())] as const
export const withEvents = () => ['events', preloadEvent] as const
export const withEventCount = () =>
  [
    'events',
    (query: RelationSubQueryBuilderContract<typeof Event>) => query.as('totalEvents'),
  ] as const

/**
 * Utils
 */
export const updateCategoryTranslation = async (
  category: EventCategory,
  payload: Infer<typeof updateEventCategoryValidator>['translations']
) => {
  await category.getOrLoadRelation('translations')
  if (G.isNotNullable(payload)) {
    const languages = A.map(await Language.all(), D.prop('id'))
    await Promise.all(
      A.map(D.toPairs(payload), async ([languageId, translation]) => {
        // Step 1 - check if language is supported
        if (!languages.includes(languageId)) return
        // Step 2 - check if translation already exists
        const current = A.find(category.translations, (t) => t.languageId === languageId)
        // Step 3 - update or create translation
        if (G.isNotNullable(current)) return current.merge(translation).save()
        else return category.related('translations').create({ languageId, ...translation })
      })
    )
    await category.load(...withEventCategoryTranslations())
  }
}
