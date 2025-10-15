import Content, { preloadContent } from '#models/content'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { preloadFiles } from '#models/media-file'
import ProjectCategory from '#models/project-category'
import ProjectStep, { preloadProjectSteps } from '#models/project-step'
import Seo, { preloadSeo } from '#models/seo'
import Slug from '#models/slug'
import Tracking from '#models/tracking'
import User, { withProfile } from '#models/user'
import Workspace from '#models/workspace'
import { makeTerms } from '#utils/string'
import {
  filterProjectsByValidator,
  sortProjectsByValidator,
  updateProjectCategoryValidator,
  updateProjectTagValidator,
} from '#validators/projects'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  PreloaderContract,
  RelationQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G, S } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import ProjectTag from './project-tag.js'
import Publication, { preloadPublicPublication } from './publication.js'
import { makeWorkspaceConfig } from './workspace-config.js'

/**
 * Model for Project (CMS)
 * project is a cms container for a project
 */
type Model = Project
export default class Project extends ExtendedModel {
  public static table = 'projects'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare location: string

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

  @hasMany(() => ProjectStep, { foreignKey: 'projectId' })
  declare steps: HasMany<typeof ProjectStep>

  @column()
  declare categoryId: string | null
  @belongsTo(() => ProjectCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof ProjectCategory>

  @column()
  declare tagId: string | null
  @belongsTo(() => ProjectTag, { foreignKey: 'tagId' })
  declare tag: BelongsTo<typeof ProjectTag>

  @column()
  declare state: ProjectState

  // displaying author
  @column()
  declare publicationId: string | null
  @belongsTo(() => Publication, { foreignKey: 'publicationId' })
  declare publication: BelongsTo<typeof Publication>

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
    const [seo, content, publication, tracking, slug] = await Promise.all([
      Seo.create({}),
      Content.create({}),
      Publication.create({}),
      Tracking.create({ type: 'views', model: 'project', workspaceId: ressource.workspaceId }),
      Slug.create({ model: 'project', workspaceId: ressource.workspaceId }),
    ])
    ressource.seoId = seo.id
    ressource.contentId = content.id
    ressource.publicationId = publication.id
    ressource.trackingId = tracking.id
    ressource.slugId = slug.id
    ressource.state ??= projectDefaultState
    ressource.categoryId ??= null
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const slug = await ressource.getOrLoadRelation('slug')
    // get slug prefix from workspace config or use default one
    const slugPrefix =
      (await ressource.getOrLoadRelation('workspace'))?.config.projects?.slugPrefix ??
      makeWorkspaceConfig().projects.slugPrefix
    slug
      ?.merge({ slug: `${slugPrefix}/${ressource.id}`, path: `${slugPrefix}/${ressource.id}` })
      .save()
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filterBy: Infer<typeof filterProjectsByValidator>) => {
    type ProjectQuery = ModelQueryBuilderContract<typeof Project, Project>
    const typeQuery = query as ProjectQuery
    if (D.isEmpty(filterBy)) return typeQuery
    const { categories, years, tags, in: inIds } = filterBy
    if (G.isNotNullable(categories)) typeQuery.andWhereIn('categoryId', categories)
    if (G.isNotNullable(tags)) typeQuery.andWhereIn('tagId', tags)
    if (G.isNotNullable(years)) {
      typeQuery.andWhereHas('publication', (publicationQuery) => {
        publicationQuery.whereIn(typeQuery.client.raw('YEAR(published_at)'), years)
      })
    }
    if (G.isNotNullable(inIds)) typeQuery.andWhereIn('id', inIds)
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortProjectsByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static search = scope((query, search: string | undefined, language: Language) => {
    type ProjectQuery = ModelQueryBuilderContract<typeof Project, Project>
    const typeQuery = query as ProjectQuery
    if (G.isNullable(search) || S.isEmpty(search)) return
    const terms = makeTerms(search)

    if (A.isNotEmpty(terms)) {
      return typeQuery.whereHas('seo', (seoQuery) =>
        seoQuery.whereHas('translations', (translationQuery) =>
          translationQuery.where('language_id', language.id).andWhere((mainQuery) => {
            for (const term of terms) {
              mainQuery.where((termQuery) => {
                termQuery.whereRaw('LOWER(seo_translations.title) LIKE ?', [
                  `%${term.toLowerCase()}%`,
                ])
                termQuery.orWhereRaw('LOWER(seo_translations.description) LIKE ?', [
                  `%${term.toLowerCase()}%`,
                ])
              })
            }
          })
        )
      )
    }
  })

  public static limit = scope((query, limit: number | undefined) => {
    if (G.isNullable(limit)) return query
    return query.limit(limit)
  })

  public static isPublished = scope((query: ModelQueryBuilderContract<typeof Project, Project>) => {
    return query.where('state', 'published').whereHas('publication', (publicationQuery) => {
      publicationQuery
        .where((subQuery: any) =>
          subQuery.where('publishedFrom', '<=', DateTime.now().toSQL()).orWhereNull('publishedFrom')
        )
        .andWhere((subQuery: any) =>
          subQuery.where('publishedTo', '>=', DateTime.now().toSQL()).orWhereNull('publishedTo')
        )
    })
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'publishedTo',
        'publishedFrom',
        'slugId',
        'state',
        'authorId',
        'createdById',
        'updatedById',
        'createdAt',
        'updatedAt',
      ]),
      trackingId: this.trackingId,
      seo: this.seo?.publicSerialize(language),
      content: this.content?.publicSerialize(language),
      category: this.category?.publicSerialize(language),
      tag: this.tag?.publicSerialize(language),
      publication: this.publication?.publicSerialize(language),
      slug: this.slug?.publicSerialize(language),
      steps: A.map(this?.steps ?? [], (step) => step.publicSerialize(language)),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(
      A.map(['seo', 'content', 'tracking', 'slug', 'publication'] as const, async (related) =>
        (await this.getOrLoadRelation(related)).delete()
      )
    )
    await Promise.all(A.map(await this.getOrLoadRelation('steps'), (step) => step.cleanup()))
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
 * constants and types related to projects
 */
export const projectStates = ['draft', 'published'] as const
export type ProjectState = (typeof projectStates)[number]
export const projectDefaultState = projectStates[0]

/**
 * preloaders
 */
export const preloadCategory = (query: PreloaderContract<ProjectCategory>) =>
  query
    .preload('translations', (query) => query.preload('image', preloadFiles))
    .preload('createdBy', withProfile)
    .preload('updatedBy', withProfile)
export const preloadVisits = (query: RelationQueryBuilderContract<typeof Tracking, any>) =>
  query.withCount('traces', (query) => query.as('visits'))
export const preloadProjects = (query: RelationQueryBuilderContract<typeof Project, any>) =>
  query
    .preload('seo', preloadSeo)
    .preload('content', preloadContent)
    .preload('tracking', preloadVisits)
    .preload('publication', preloadPublicPublication)
    .preload('createdBy', withProfile)
    .preload('updatedBy', withProfile)
    .preload('steps', preloadProjectSteps)

/**
 * utils
 */
export const defaultInterval = { publishedFrom: null, publishedTo: null }
export const parseInterval = (
  valid: {
    publishedFrom?: Date | null
    publishedTo?: Date | null
  },
  fallback: {
    publishedFrom: DateTime | null
    publishedTo: DateTime | null
  }
): { publishedFrom: DateTime<true> | null; publishedTo: DateTime<true> | null } => {
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

export const updateCategoryTranslation = async (
  category: ProjectCategory,
  payload: Infer<typeof updateProjectCategoryValidator>['translations']
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
    await category.load('translations', (query) => query.preload('image', preloadFiles))
  }
}
export const updateTagTranslation = async (
  tag: ProjectTag,
  payload: Infer<typeof updateProjectTagValidator>['translations']
) => {
  await tag.getOrLoadRelation('translations')
  if (G.isNotNullable(payload)) {
    const languages = A.map(await Language.all(), D.prop('id'))
    await Promise.all(
      A.map(D.toPairs(payload), async ([languageId, translation]) => {
        // Step 1 - check if language is supported
        if (!languages.includes(languageId)) return
        // Step 2 - check if translation already exists
        const current = A.find(tag.translations, (t) => t.languageId === languageId)
        // Step 3 - update or create translation
        if (G.isNotNullable(current)) return current.merge(translation).save()
        else return tag.related('translations').create({ languageId, ...translation })
      })
    )
    await tag.load('translations')
  }
}

/**
 * check if a project is available
 */
export const isAvailableProject = async (project: Project) => {
  if (project.state !== 'published') return false
  const publication = await project.getOrLoadRelation('publication')
  const now = DateTime.now()
  const isAfterFrom = publication.publishedFrom ? now <= publication.publishedFrom : true
  const isBeforeUntil = publication.publishedTo ? now >= publication.publishedTo : true
  return isAfterFrom && isBeforeUntil
}
