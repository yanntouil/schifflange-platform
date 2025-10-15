import Content, { preloadContent } from '#models/content'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import Project from '#models/project'
import Seo, { preloadSeo } from '#models/seo'
import Slug from '#models/slug'
import Tracking from '#models/tracking'
import User, { withProfile } from '#models/user'
import Workspace from '#models/workspace'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  scope,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  RelationQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for Project (CMS)
 * project is a cms container for a project
 */
type Model = ProjectStep
export default class ProjectStep extends ExtendedModel {
  public static table = 'project_steps'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: ProjectStepType

  @column({ serializeAs: null })
  declare seoId: string
  @belongsTo(() => Seo, { foreignKey: 'seoId' })
  declare seo: BelongsTo<typeof Seo>

  @column()
  declare projectId: string
  @belongsTo(() => Project, { foreignKey: 'projectId' })
  declare project: BelongsTo<typeof Project>

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

  @column()
  declare state: ProjectStepState

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
    const [seo, content, tracking, slug] = await Promise.all([
      Seo.create({}),
      Content.create({}),
      Tracking.create({ type: 'views', model: 'project', workspaceId: ressource.workspaceId }),
      Slug.create({ model: 'project-step', workspaceId: ressource.workspaceId }),
    ])
    ressource.seoId = seo.id
    ressource.contentId = content.id
    ressource.trackingId = tracking.id
    ressource.slugId = slug.id
    ressource.state ??= projectStepDefaultState
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    // get parent project
    const project = await Project.query().where('id', ressource.projectId).preload('slug').first()
    await ressource.getOrLoadRelation('slug')
    // if no project, use the step id as slug
    if (G.isNullable(project))
      return ressource.slug?.merge({ slug: `${ressource.id}`, path: `${ressource.id}` }).save()
    // if project, use the project slug and the step type as slug
    await ressource.slug
      ?.merge({
        slug: `${project.slug.path}/${ressource.type}`,
        path: `${project.slug.path}/${ressource.type}`,
      })
      .save()
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static isPublished = scope((query) => {
    return query.where('state', 'published')
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'slugId',
        'state',
        'createdById',
        'updatedById',
        'createdAt',
        'updatedAt',
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
      A.map(['seo', 'content', 'tracking', 'slug'] as const, async (related) =>
        (await this.getOrLoadRelation(related)).delete()
      )
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
 * constants and types related to projects
 */
export const projectStepStates = ['draft', 'published'] as const
export type ProjectStepState = (typeof projectStepStates)[number]
export const projectStepDefaultState = projectStepStates[0]

export const projectStepTypes = ['consultation', 'incubation', 'scaling'] as const
export type ProjectStepType = (typeof projectStepTypes)[number]
export const projectStepDefaultType = projectStepTypes[0]

/**
 * preloaders
 */
export const preloadVisits = (query: RelationQueryBuilderContract<typeof Tracking, any>) =>
  query.withCount('traces', (query) => query.as('visits'))
export const preloadProjectSteps = (query: RelationQueryBuilderContract<typeof ProjectStep, any>) =>
  query
    .preload('seo', preloadSeo)
    .preload('content', preloadContent)
    .preload('tracking', preloadVisits)
    .preload('createdBy', withProfile)
    .preload('updatedBy', withProfile)

/**
 * check if a project step is available
 */
export const isAvailableProjectStep = async (projectStep: ProjectStep) => {
  return projectStep.state === 'published'
}
