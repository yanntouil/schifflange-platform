import Content from '#models/content'
import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import TemplateTranslation from '#models/template-translation'
import User from '#models/user'
import { Infer } from '#start/vine'
import {
  filterTemplatesByValidator,
  sortTemplatesByValidator,
  updateTemplateValidator,
} from '#validators/templates'
import { afterCreate, beforeCreate, beforeDelete, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations, HasMany } from '@adonisjs/lucid/types/relations'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model for Template (CMS)
 * template is a cms container for a template
 */
type Model = Template
export default class Template extends ExtendedModel {
  public static table = 'templates'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: TemplateType

  @column({ serializeAs: null })
  declare contentId: string
  @belongsTo(() => Content, { foreignKey: 'contentId' })
  declare content: BelongsTo<typeof Content>

  @column({ serializeAs: null })
  declare workspaceId: string

  @hasMany(() => TemplateTranslation, { foreignKey: 'templateId' })
  declare translations: HasMany<typeof TemplateTranslation>

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
    const content = await Content.create({})
    ressource.contentId = content.id
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
   * SCOPES
   */

  public static filterBy = scope((query, filterBy: Infer<typeof filterTemplatesByValidator>) => {
    if (D.isEmpty(filterBy)) return query
    const { types } = filterBy
    if (G.isNotNullable(types)) query.andWhereIn('type', types)
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortTemplatesByValidator>) => {
    const { field = 'createdAt', direction = 'desc' } = sortBy
    return query.orderBy(field, direction)
  })

  public static limit = scope((query, limit: number | undefined) => {
    if (G.isNullable(limit)) return query
    return query.limit(limit)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  updateTranslation = async (
    translations: Infer<typeof updateTemplateValidator>['translations']
  ) => {
    const that = this as Model
    if (G.isNotNullable(translations)) {
      await that.getOrLoadRelation('translations')
      const languages = A.map(await Language.all(), D.prop('id'))
      await Promise.all(
        A.map(D.toPairs(translations), async ([languageId, translation]) => {
          // Step 1 - check if language is supported
          if (!languages.includes(languageId)) return
          // Step 2 - check if translation already exists
          const current = A.find(that.translations, (t) => t.languageId === languageId)
          // Step 3 - update or create translation
          if (G.isNotNullable(current)) {
            return current.merge(translation).save()
          } else return that.related('translations').create({ languageId, ...translation })
        })
      )
    }
  }

  public async cleanup() {
    await Promise.all(
      A.map(['content', 'translations'] as const, async (related) => {
        const relation = await this.getOrLoadRelation(related)
        if (Array.isArray(relation)) {
          await Promise.all(
            relation.map(async (item) => {
              await item.cleanup()
              await item.delete()
            })
          )
        } else {
          await relation.cleanup()
          await relation.delete()
        }
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
 * constants and types related to templates
 */
export const templateTypes = ['page', 'article', 'project'] as const
export type TemplateType = (typeof templateTypes)[number]
export const templateDefaultType = templateTypes[0]
