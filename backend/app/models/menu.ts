import ExtendedModel from '#models/extended/extended-model'
import MenuItem, { isAvailableItem } from '#models/menu-item'
import { beforeDelete, column, hasMany } from '@adonisjs/lucid/orm'
import type { ExtractModelRelations, HasMany } from '@adonisjs/lucid/types/relations'
import { A, D, G, O } from '@mobily/ts-belt'
import Language from './language.js'

/**
 * Model for Menu
 * menu is a collection of menu users can manage through the crm
 */
type Model = Menu
export default class Menu extends ExtendedModel {
  public static table = 'menus'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare location: string

  @hasMany(() => MenuItem, {
    foreignKey: 'menuId',
  })
  declare items: HasMany<typeof MenuItem>

  @column({ serializeAs: null })
  declare workspaceId: string | null

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
    return {
      ...D.deleteKeys(this.serialize(), ['items']),
      items: A.filterMap(this.items, (item) =>
        isAvailableItem(item) ? O.Some(item.publicSerialize(language)) : O.None
      ),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    await Promise.all(A.map(await this.getOrLoadRelation('items'), (item) => item.cleanup()))
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }
}
