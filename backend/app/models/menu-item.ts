import ExtendedModel from '#models/extended/extended-model'
import MediaFile from '#models/media-file'
import Menu from '#models/menu'
import MenuItemTranslation from '#models/menu-item-translation'
import Slug from '#models/slug'
import User from '#models/user'
import { columnJSON } from '#utils/column-json'
import { createMenuItemValidator } from '#validators/menus'
import { beforeDelete, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ExtractModelRelations,
  HasMany,
  ManyToMany,
} from '@adonisjs/lucid/types/relations'
import { A, D, G, O } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import { isAvailableArticle } from './article.js'
import Language from './language.js'

/**
 * Model for MenuItem
 * menu item is a single item in a menu
 */
type Model = MenuItem
export default class MenuItem extends ExtendedModel {
  public static table = 'menu_items'

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare menuId: string
  @belongsTo(() => Menu, { foreignKey: 'menuId' })
  declare menu: BelongsTo<typeof Menu>

  @column()
  declare order: number

  // state of publication
  @column()
  declare state: MenuItemState

  @column()
  declare parentId: string | null
  @belongsTo(() => MenuItem, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof MenuItem>
  @hasMany(() => MenuItem, { foreignKey: 'parentId' })
  declare children: HasMany<typeof MenuItem>

  @column()
  declare slugId: string | null
  @belongsTo(() => Slug, { foreignKey: 'slugId' })
  declare slug: BelongsTo<typeof Slug>

  @column()
  declare type: string

  // props of the menu item defined by the frontend
  @column(columnJSON<Record<string, unknown>>({}))
  declare props: Record<string, unknown>

  // translations of the item
  @hasMany(() => MenuItemTranslation, { foreignKey: 'menuItemId' })
  declare translations: HasMany<typeof MenuItemTranslation>

  // related files of the item
  @manyToMany(() => MediaFile, {
    localKey: 'id',
    pivotForeignKey: 'item_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'file_id',
    pivotTable: 'menu_items_files',
  })
  declare files: ManyToMany<typeof MediaFile>

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
        'slugId',
        'slug',
        'menuId',
        'translations',
        'files',
        'createdById',
        'updatedById',
        'createdAt',
        'updatedAt',
      ]),
      translations: A.find(
        this.translations,
        (translation) => translation.languageId === language.id
      )?.publicSerialize(language),
      files: A.filterMap(this.files, (file) => file.publicSerialize(language)),
      slug: this.slug?.publicSerialize(language),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public static async inTree(items: MenuItem[]) {
    return populateTree(null, items)
  }

  public async isParentOf(id: string, allItems: MenuItem[]) {
    return isInTree(id, populateTree(this.id, allItems))
  }

  public isChildOf(id: string, allItems: MenuItem[]) {
    return isInTree(this.id, populateTree(id, allItems))
  }

  public async cleanup() {
    await Promise.all([
      ...A.map(await this.getOrLoadRelation('translations'), (translation) =>
        translation.cleanup()
      ),
      ...A.map(await this.getOrLoadRelation('children'), (child) => child.cleanup()),
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
 * constants and types related to menu items
 */
export const menuItemStates = ['draft', 'published'] as const
export type MenuItemState = (typeof menuItemStates)[number]
export const menuItemDefaultState = menuItemStates[0]

/**
 * utils
 */
export const updateMenuItemTranslation = async (
  item: MenuItem,
  payload: Infer<typeof createMenuItemValidator>['translations']
) => {
  await item.getOrLoadRelation('translations')
  if (G.isNotNullable(payload)) {
    const languages = A.map(await Language.all(), D.prop('id'))
    await Promise.all(
      A.map(D.toPairs(payload), async ([languageId, translation]) => {
        // Step 1 - check if language is supported
        if (!languages.includes(languageId)) return
        // Step 2 - check if translation already exists
        const current = A.find(item.translations, (t) => t.languageId === languageId)
        // Step 3 - update or create translation
        if (G.isNotNullable(current)) return current.merge(translation).save()
        else return item.related('translations').create({ languageId, ...translation })
      })
    )
    await item.load('translations')
  }
}

/**
 * utils
 */
const populateTree = (id: string | null, items: MenuItem[]): MenuItemsTree =>
  A.filterMap(items, (item) =>
    item.parentId === id
      ? {
          id: item.id,
          parentId: id,
          items: populateTree(item.id, items),
        }
      : O.None
  )
const isInTree = (id: string, tree: MenuItemsTree): boolean =>
  A.some(tree, (item) =>
    item.id === id ? true : A.isNotEmpty(item.items) ? isInTree(id, item.items) : false
  )

/**
 * types
 */
type MenuItemsTree = { id: string; parentId: string | null; items: MenuItemsTree }[]

/**
 * check if an item is available
 */
export const isAvailableItem = (item: MenuItem) => {
  if (item.state !== 'published') return false
  if (item.type !== 'ressource') return true
  if (item.slug?.model === 'article') return isAvailableArticle(item.slug.article)
  if (item.slug?.model === 'page') return item.slug.page?.state === 'published'
  return false
}
