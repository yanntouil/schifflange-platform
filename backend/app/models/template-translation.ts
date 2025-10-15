import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import { columnJSON } from '#utils/column-json'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import Template from './template.js'

/**
 * Model for Template Translation (CMS)
 * template translation is a translation part of a template
 */
type Model = TemplateTranslation
export default class TemplateTranslation extends ExtendedModel {
  public static table = 'template_translations'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column()
  declare languageId: string
  @belongsTo(() => Language, { foreignKey: 'languageId' })
  declare language: BelongsTo<typeof Language>

  @column({ serializeAs: null })
  declare templateId: string
  @belongsTo(() => Template, { foreignKey: 'templateId', serializeAs: null })
  declare template: BelongsTo<typeof Template>

  @column()
  declare title: string
  @column()
  declare description: string

  @column(columnJSON<string[]>([]))
  declare tags: string[]

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static beforeCreateHook(ressource: Model) {
    ressource.title ??= ''
    ressource.description ??= ''
    ressource.tags ??= []
  }

  @beforeDelete()
  public static async beforeDeleteHook(ressource: Model) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

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
