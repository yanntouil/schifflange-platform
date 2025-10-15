import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadFiles } from '#models/media-file'
import Menu from '#models/menu'
import MenuItem, { updateMenuItemTranslation } from '#models/menu-item'
import Slug, { preloadSlug } from '#models/slug'
import { validationFailure } from '#start/vine'
import {
  createMenuItemValidator,
  createMenuValidator,
  moveMenuItemValidator,
  reorderMenuItemsValidator,
  updateMenuItemValidator,
  updateMenuValidator,
} from '#validators/menus'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G, O, pipe } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * MenusController
 */
export default class MenusController {
  /**
   * all
   * get all menus of a workspace
   * @get workspaces/:workspaceId/menus
   * @middleware authActive workspace({as 'member'})
   * @success 200 { menus: Menu[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ workspace, response }: HttpContext) {
    const menus = await Menu.query()
      .where('workspaceId', workspace.id)
      .preload('items', (query) =>
        query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
      )
    response.ok({ menus })
  }

  /**
   * create
   * create a menu
   * @post workspaces/:workspaceId/menus
   * @middleware authActive workspace({as 'member'})
   * @success 200 { menu: Menu }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, request, response }: HttpContext) {
    const payload = await request.validateUsing(createMenuValidator)
    const menu = await Menu.create({
      ...payload,
      workspaceId: workspace.id,
    })
    await menu.refresh()
    await menu.load('items', (query) =>
      query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
    )
    response.ok({ menu })
  }

  /**
   * read
   * read a menu
   * @get workspaces/:workspaceId/menus/:menuId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { menu: Menu }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .preload('items', (query) =>
        query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
      )
      .first()
    if (G.isNullable(menu)) throw E_RESOURCE_NOT_FOUND
    response.ok({ menu })
  }

  /**
   * update
   * update a menu
   * @put workspaces/:workspaceId/menus/:menuId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { menu: Menu }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, request, response }: HttpContext) {
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .preload('items', (query) =>
        query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
      )
      .first()
    if (G.isNullable(menu)) throw E_RESOURCE_NOT_FOUND
    const payload = await request.validateUsing(updateMenuValidator)
    await menu.merge(payload).save()
    response.ok({ menu })
  }

  /**
   * delete
   * delete a menu
   * @delete workspaces/:workspaceId/menus/:menuId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { message: 'Menu deleted' }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(menu)) throw E_RESOURCE_NOT_FOUND
    await menu.delete()
    response.ok({ message: 'Menu deleted' })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * -- WORKSPACES MENU ITEMS --
   */

  /**
   * createItem
   * create a menu item
   * @post workspaces/:workspaceId/menus/:menuId/items
   * @middleware authActive workspace({as 'member'})
   * @success 200 { item: MenuItem, sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async createItem({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .preload('items')
      .first()
    if (G.isNullable(menu)) throw E_RESOURCE_NOT_FOUND

    const {
      files,
      order = menu.items.length,
      translations,
      ...payload
    } = await request.validateUsing(createMenuItemValidator)

    const now = DateTime.now()

    // check if parent exists in menu
    if (payload.parentId) {
      const parent = await MenuItem.query()
        .where('id', payload.parentId)
        .andWhere('menuId', menu.id)
        .first()
      if (G.isNullable(parent))
        return response.badRequest(validationFailure([{ parentId: 'exist in menu' }]))

      // Note: For new items, we can't check circular reference since the item doesn't exist yet
      // The circular reference check is more relevant for moving existing items
    }

    // validate slug using helper method
    await this.validateSlug(payload.slugId, workspace.id)

    // get relative children with same parent
    const parentId = payload.parentId ?? null
    const relativeChildren = A.filter(menu.items, (i) => (i.parentId ?? null) === parentId)
    const desiredOrder = Math.min(order, relativeChildren.length)

    const item = await MenuItem.create({
      ...payload,
      menuId: menu.id,
      order: desiredOrder,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    // create translations
    await updateMenuItemTranslation(item, translations)

    // sync files
    if (G.isNotNullable(files) && A.isNotEmpty(files)) {
      await item.related('files').sync(A.uniq(files))
    }

    // reorder items and get all siblings sorted
    const sortedRelativeChildren = pipe(relativeChildren, A.sortBy(D.prop('order')))

    const sortedIds = pipe(
      sortedRelativeChildren,
      A.map(D.prop('id')),
      A.insertAt(item.order, item.id)
    )
    await Promise.all(
      A.map(relativeChildren, (sibling) =>
        sibling.merge({ order: A.getIndexBy(sortedIds, (id) => id === sibling.id) ?? 0 }).save()
      )
    )
    const newIndex = A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0
    if (item.order !== newIndex) {
      await item.merge({ order: newIndex }).save()
    }

    await item.refresh()
    await item.load((query) =>
      query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
    )
    response.ok({ item, sortedIds })
  }

  /**
   * updateItem
   * update a menu item
   * @put workspaces/:workspaceId/menus/:menuId/items/:itemId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { item: MenuItem }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async updateItem({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .preload('items', (query) => query.where('id', request.param('itemId')))
      .first()

    const item = A.head(menu?.items ?? [])
    if (G.isNullable(menu) || G.isNullable(item)) throw E_RESOURCE_NOT_FOUND

    const { files, translations, ...payload } = await request.validateUsing(updateMenuItemValidator)

    const now = DateTime.now()

    // update translations
    await updateMenuItemTranslation(item, translations)

    // validate slug using helper method
    await this.validateSlug(payload.slugId, workspace.id)

    // update item
    await item.merge({ ...payload, updatedAt: now, updatedById: user.id }).save()

    // sync files
    if (G.isNotNullable(files) && A.isNotEmpty(files)) {
      await item.related('files').sync(A.uniq(files))
    }

    await item.load((query) =>
      query.preload('translations').preload('slug', preloadSlug).preload('files', preloadFiles)
    )
    response.ok({ item })
  }

  /**
   * deleteItem
   * delete a menu item
   * @delete workspaces/:workspaceId/menus/:menuId/items/:itemId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { sortedIds: string[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async deleteItem({ workspace, request, response }: HttpContext) {
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .preload('items')
      .first()
    const item = A.find(menu?.items ?? [], (item) => item.id === request.param('itemId'))
    if (G.isNullable(menu) || G.isNullable(item)) throw E_RESOURCE_NOT_FOUND

    // get relative children with same parent (fix: use i instead of item in filter)
    const relativeChildren = A.filter(menu.items, (i) => i.parentId === item.parentId)

    // get all children that will become orphans
    const orphanChildren = A.filter(menu.items, (i) => i.parentId === item.id)

    // update orphan children to have the deleted item's parent
    await Promise.all(
      A.map(orphanChildren, (child) => child.merge({ parentId: item.parentId }).save())
    )

    // sort items ids (excluding the deleted item)
    const sortedIds = pipe(
      relativeChildren,
      A.sortBy(D.prop('order')),
      A.filterMap(({ id }) => (id === item.id ? O.None : O.Some(id)))
    )

    // delete item
    await item.delete()

    // reorder items
    await Promise.all(
      A.mapWithIndex(sortedIds, (order, id) =>
        A.find(relativeChildren, (i) => i.id === id)
          ?.merge({ order })
          .save()
      )
    )
    response.ok({ sortedIds })
  }

  /**
   * reorderItems
   * reorder menu items
   * @put workspaces/:workspaceId/menus/:menuId/items
   * @put workspaces/:workspaceId/menus/items/:itemId/items
   * @middleware authActive workspace({as 'member'})
   * @success 200 { sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async reorderItems({ workspace, request, response }: HttpContext) {
    const menu = await Menu.query()
      .where('id', request.param('menuId'))
      .andWhere('workspaceId', workspace.id)
      .preload('items')
      .first()
    if (G.isNullable(menu)) throw E_RESOURCE_NOT_FOUND
    const items = A.filter(
      menu.items,
      (item) => item.parentId === (request.param('itemId') || null)
    )

    const { items: sortedIds } = await request.validateUsing(reorderMenuItemsValidator)

    if (!A.every(items, ({ id }) => A.includes(sortedIds, id)))
      return response.badRequest(validationFailure([{ field: 'items', rule: 'exist' }]))

    // reorder items
    await Promise.all(
      A.mapWithIndex(sortedIds, (order, id) =>
        A.find(items, (item) => item.id === id)
          ?.merge({ order })
          .save()
      )
    )

    response.ok({ sortedIds })
  }

  /**
   * moveItem
   * move a menu item
   * @put workspaces/:workspaceId/menus/items/:itemId/move
   * @middleware authActive workspace({as 'member'})
   * @success 200 { sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async moveItem({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    // Fix: get items with proper relation to workspace through menu
    const items = await MenuItem.query()
      .whereHas('menu', (query) => {
        query.where('workspaceId', workspace.id)
      })
      .preload('menu')

    const item = A.find(items, (item) => item.id === request.param('itemId'))
    if (G.isNullable(item)) throw E_RESOURCE_NOT_FOUND
    const updatedAt = DateTime.now()
    const updatedById = user.id

    const payload = await request.validateUsing(moveMenuItemValidator)

    if (G.isNotNullable(payload.parentId) || G.isNotNullable(payload.menuId)) {
      let menuId: string | null = null
      if (G.isNotNullable(payload.parentId)) {
        // case 1: change parent id
        const parent = A.find(items, ({ id }) => id === payload.parentId)
        if (G.isNullable(parent))
          return response.badRequest(validationFailure([{ parentId: 'parentId does not exist' }]))

        // Use our helper method for circular reference check
        if (this.isCircularReference(item.id, payload.parentId, items))
          return response.badRequest(
            validationFailure([{ parentId: 'would create circular reference' }])
          )

        item.parentId = parent.id
        item.order = A.filter(items, ({ parentId }) => parentId === parent.id).length
        menuId = parent.menuId
      } else {
        // case 2: move to menu (fix: use payload.menuId instead of request.param)
        const menu = await Menu.query()
          .where('workspaceId', workspace.id)
          .andWhere('id', payload.menuId!)
          .first()
        if (G.isNullable(menu))
          return response.badRequest(validationFailure([{ menuId: 'menuId does not exist' }]))
        menuId = menu.id
        // reset parent when moving to new menu
        item.parentId = null
        item.order = 0
      }

      // in case of move to an other menu
      if (item.menuId !== menuId) {
        item.menuId = menuId
        // update recursive children with new menuId
        await Promise.all(
          A.map(
            items,
            (i) => i.isChildOf(item.id, items) && i.merge({ menuId, updatedAt, updatedById }).save()
          )
        )
      }

      await item.merge({ updatedAt, updatedById }).save()
    }

    await item.load((query) => query.preload('translations').preload('files', preloadFiles))
    response.ok({ item })
  }

  /**
   * Helper method to validate slug existence
   */
  private async validateSlug(slugId: string | null | undefined, workspaceId: string) {
    if (G.isNullable(slugId)) return null

    const slug = await Slug.query().where('id', slugId).andWhere('workspaceId', workspaceId).first()

    if (G.isNullable(slug)) {
      throw validationFailure([{ field: 'slugId', rule: 'exists' }])
    }

    return slug
  }

  /**
   * Helper method to check circular reference
   */
  private isCircularReference(itemId: string, parentId: string, allItems: MenuItem[]): boolean {
    if (itemId === parentId) return true

    const parent = A.find(allItems, (item) => item.id === parentId)
    if (G.isNullable(parent) || G.isNullable(parent.parentId)) return false

    return this.isCircularReference(itemId, parent.parentId, allItems)
  }
}
