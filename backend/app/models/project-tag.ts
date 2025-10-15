import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import Project from '#models/project'
import ProjectTagTranslation from '#models/project-tag-translation'
import User from '#models/user'
import {
  afterCreate,
  beforeCreate,
  beforeDelete,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  RelationQueryBuilderContract,
} from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for Project Tag (CMS)
 * project tag is a cms container for a project tag
 */
type Model = ProjectTag
export default class ProjectTag extends ExtendedModel {
  public static table = 'project_tags'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare order: number

  @column()
  declare type: ProjectTagType

  @hasMany(() => ProjectTagTranslation, {
    foreignKey: 'tagId',
  })
  declare translations: HasMany<typeof ProjectTagTranslation>

  @hasMany(() => Project, { foreignKey: 'tagId' })
  declare projects: HasMany<typeof Project>

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
    ressource.order ??= 0
  }

  @afterCreate()
  public static async afterCreateHook(ressource: Model) {
    const languages = await Language.all()
    await Promise.all(
      A.map(languages, async (language) => {
        await ressource.related('translations').create({ languageId: language.id })
      })
    )
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * COMPUTEDS
   */

  @computed()
  public get totalProjects() {
    return this.$extras?.totalProjects
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public publicSerialize(language: Language) {
    return {
      ...D.deleteKeys(this.serialize(), [
        'createdById',
        'createdBy',
        'createdAt',
        'updatedById',
        'updatedBy',
        'updatedAt',
      ]),
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
    await Promise.all(
      A.map(await this.getOrLoadRelation('translations'), ({ cleanup }) => cleanup())
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
export const preloadProjectTag = (query: RelationQueryBuilderContract<typeof ProjectTag, any>) =>
  query.preload('translations')

/**
 * constants and types related to project tags
 */
export const projectTagType = ['non-formal-education', 'child-family-services'] as const
export const projectTagTypeDefault = projectTagType[0]
export type ProjectTagType = (typeof projectTagType)[number]
