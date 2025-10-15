import ExtendedModel from '#models/extended/extended-model'
import Language from '#models/language'
import MenuItem from '#models/menu-item'
import { columnJSON } from '#utils/column-json'
import { beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'

/**
 * Model for MenuItem
 * menu item is a single item in a menu
 */
type Model = MenuItemTranslation
export default class MenuItemTranslation extends ExtendedModel {
  public static table = 'menu_item_translations'

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
  declare menuItemId: string
  @belongsTo(() => MenuItem, { foreignKey: 'menuItemId', serializeAs: null })
  declare menuItem: BelongsTo<typeof MenuItem>

  @column()
  declare name: string

  @column()
  declare description: string

  @column(columnJSON<Record<string, unknown>>({}))
  declare props: Record<string, unknown>

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
    return D.deleteKeys(this.serialize(), ['languageId', 'menuItemId'])
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
