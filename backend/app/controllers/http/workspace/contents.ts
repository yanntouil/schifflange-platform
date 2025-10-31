import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Article from '#models/article'
import {
  copyContentItems,
  preloadContentItems,
  updateContentItemTranslation,
  withContent,
} from '#models/content'
import { preloadFiles } from '#models/media-file'
import Page from '#models/page'
import { preloadSlug } from '#models/slug'
import Template from '#models/template'
import Workspace from '#models/workspace'
import { validationFailure } from '#start/vine'
import {
  createContentItemValidator,
  reorderContentItemsValidator,
  updateContentItemValidator,
  updateContentValidator,
} from '#validators/contents'
import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import { A, D, G, O, pipe } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * ContentsController
 */
export default class ContentsController {
  /**
   * update
   * update the content of a collection item
   * @put workspaces/:workspaceId/collections/:collectionId/content
   * @middleware authActive workspace({as 'member'})
   * @success 200 { content: Content }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const item = await getModelResource(request, workspace)
    if (G.isNullable(item)) throw E_RESOURCE_NOT_FOUND

    const payload = await request.validateUsing(updateContentValidator)
    await item.content.merge({ ...payload }).save()

    // update collection timestamp
    await item.merge({ updatedById: user.id, updatedAt: DateTime.now() }).save()

    response.ok({ content: item.content.serialize() })
  }

  /**
   * createItem
   * create a content item
   * @post workspaces/:workspaceId/collections/:collectionId/content/items
   * @middleware authActive workspace({as 'member'})
   * @success 200 { item: ContentItem, sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async createItem({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const collectionItem = await getModelResource(request, workspace)
    const content = collectionItem?.content
    if (G.isNullable(collectionItem) || G.isNullable(content)) throw E_RESOURCE_NOT_FOUND
    const {
      files,
      order = content.items.length, // after last item
      translations,
      ...payload
    } = await request.validateUsing(createContentItemValidator)

    const now = DateTime.now()

    // create item
    const item = await content.related('items').create({
      ...payload,
      order: order === 0 || order < content.items.length ? order : content.items.length,
      createdAt: now,
      createdById: user.id,
    })

    // create translations
    await updateContentItemTranslation(item, translations)

    // sync files
    if (G.isNotNullable(files) && A.isNotEmpty(files)) {
      await item.related('files').sync(A.uniq(files))
    }

    // reorder items
    const sortedIds = pipe(
      content.items,
      A.sortBy(D.prop('order')),
      A.map(D.prop('id')),
      A.insertAt(item.order, item.id)
    )
    await Promise.all(
      A.map(content.items, (item) =>
        item.merge({ order: A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0 }).save()
      )
    )

    // update collection timestamp
    await item.merge({ updatedById: user.id, updatedAt: now }).save()

    await item.refresh()
    await item.load(preloadContentItems)

    response.ok({ item: item.serialize(), sortedIds })
  }

  /**
   * updateItem
   * update a content item
   * @put workspaces/:workspaceId/collections/:collectionId/content/items/:itemId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { item: ContentItem }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async updateItem({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const collectionItem = await getModelResource(request, workspace)
    const content = collectionItem?.content
    const item = A.find(content?.items ?? [], (item) => item.id === request.param('itemId'))
    if (G.isNullable(collectionItem) || G.isNullable(content) || G.isNullable(item))
      throw E_RESOURCE_NOT_FOUND

    const { files, slugs, translations, ...payload } = await request.validateUsing(
      updateContentItemValidator
    )

    const now = DateTime.now()

    // update translations
    await updateContentItemTranslation(item, translations)

    // update item
    await item.merge({ ...payload, updatedAt: now, updatedById: user.id }).save()

    // update collection timestamp
    await collectionItem.merge({ updatedById: user.id, updatedAt: now }).save()

    // sync files
    if (G.isNotNullable(files)) {
      await item.related('files').sync(A.uniq(files))
      await item.load('files', preloadFiles)
    }
    // sync slugs
    if (G.isNotNullable(slugs)) {
      await item.related('slugs').sync(A.uniq(slugs))
      await item.load('slugs', preloadSlug)
    }

    A.forEach(workspace.languages, async (language) => {
      const pattern = `preview|${language.code}|item|${item.id}`
      const translatedItem = item.publicSerialize(language) as Broadcastable
      transmit.broadcast(pattern, translatedItem)
    })
    // reload item after update
    await item.refresh()
    await item.load(preloadContentItems)

    response.ok({ item: item.serialize() })
  }

  /**
   * deleteItem
   * delete a content item
   * @delete workspaces/:workspaceId/collections/:collectionId/content/items/:itemId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { item: ContentItem }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async deleteItem({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const collectionItem = await getModelResource(request, workspace)
    const content = collectionItem?.content
    const item = A.find(content?.items ?? [], (item) => item.id === request.param('itemId'))
    if (G.isNullable(collectionItem) || G.isNullable(content) || G.isNullable(item))
      throw E_RESOURCE_NOT_FOUND

    // sort items ids
    const sortedIds = pipe(
      content.items,
      A.sortBy(D.prop('order')),
      A.filterMap(({ id }) => (id === item.id ? O.None : O.Some(id)))
    )

    // delete item
    await item.delete()

    // reorder items
    await Promise.all(
      A.mapWithIndex(sortedIds, (order, id) =>
        A.find(content.items, (item) => item.id === id)
          ?.merge({ order })
          .save()
      )
    )

    // update collection timestamp
    await collectionItem.merge({ updatedById: user.id, updatedAt: DateTime.now() }).save()

    response.ok({ item: item.serialize() })
  }

  /**
   * appendFromTemplate
   * append content items from a template
   * @post workspaces/:workspaceId/collections/:collectionId/content/items/from-template/:fromTemplateId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { items: ContentItem[], sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async appendFromTemplate({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const collectionItem = await getModelResource(request, workspace)
    const content = collectionItem?.content
    if (G.isNullable(collectionItem) || G.isNullable(content)) throw E_RESOURCE_NOT_FOUND

    // Load template with items and their translations
    const template = await Template.query()
      .where('id', request.param('fromTemplateId'))
      .andWhere('workspaceId', workspace.id)
      .preload('content', (query) => query.preload('items', preloadContentItems))
      .first()
    if (G.isNullable(template)) throw E_RESOURCE_NOT_FOUND

    // Get position from query params (default to end)
    const inputOrder = request.input('order')
    const position = G.isNotNullable(inputOrder) ? Number(inputOrder) : content.items.length
    const order =
      position === 0 || position < content.items.length ? position : content.items.length

    // Store existing items sorted by order
    const oldItems = pipe(content.items, A.sortBy(D.prop('order')))
    const oldItemIds = A.map(oldItems, D.prop('id'))
    const templateItemsCount = template.content.items.length

    // Reorganize existing items orders BEFORE copying
    await Promise.all([
      // Items before position: keep their index
      ...A.mapWithIndex(oldItems.slice(0, order), (index, item) =>
        item.merge({ order: index }).save()
      ),
      // Items after position: shift by templateItemsCount
      ...A.mapWithIndex(oldItems.slice(position), (index, item) =>
        item.merge({ order: order + templateItemsCount + index }).save()
      ),
    ])

    // Copy template content items at the position
    await copyContentItems(template.content, content, order, user.id)

    // Reload items with preload
    await content.load('items', preloadContentItems)

    // Build final sorted ids
    const sortedIds = pipe(content.items, A.sortBy(D.prop('order')), A.map(D.prop('id')))

    // Get only the newly created items (those not in oldItemIds)
    const newItems = A.filter(content.items, (item) => !A.includes(oldItemIds, item.id))

    // Update collection timestamp
    await collectionItem.merge({ updatedById: user.id, updatedAt: DateTime.now() }).save()

    response.ok({ items: A.map(newItems, (item) => item.serialize()), sortedIds })
  }

  /**
   * reorderItems
   * reorder content items
   * @put workspaces/:workspaceId/collections/:collectionId/content/items
   * @middleware authActive workspace({as 'member'})
   * @success 200 { sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async reorderItems({ workspace, auth, request, response }: HttpContext) {
    const user = auth!.user!
    const collectionItem = await getModelResource(request, workspace)
    const content = collectionItem?.content
    if (G.isNullable(collectionItem) || G.isNullable(content)) throw E_RESOURCE_NOT_FOUND

    const { items: sortedIds } = await request.validateUsing(reorderContentItemsValidator)

    if (!A.every(content.items, ({ id }) => A.includes(sortedIds, id)))
      return response.badRequest(validationFailure([{ field: 'items', rule: 'exist' }]))

    // reorder items
    await Promise.all(
      A.mapWithIndex(sortedIds, (order, id) =>
        A.find(content.items, (item) => item.id === id)
          ?.merge({ order })
          .save()
      )
    )

    // update collection timestamp
    await collectionItem.merge({ updatedById: user.id, updatedAt: DateTime.now() }).save()

    response.ok({ sortedIds })
  }
}

/**
 * related model bridge
 */
const getModelResource = async (request: HttpContext['request'], workspace: Workspace) => {
  if (G.isNotNullable(request.param('templateId')))
    return await Template.query()
      .where('id', request.param('templateId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withContent())
      .first()
  if (G.isNotNullable(request.param('pageId')))
    return await Page.query()
      .where('id', request.param('pageId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withContent())
      .first()
  if (G.isNotNullable(request.param('articleId')))
    return await Article.query()
      .where('id', request.param('articleId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withContent())
      .first()
  throw new Error('Model not found')
}

/**
 * types
 */
type Broadcastable =
  | {
      [key: string]: Broadcastable
    }
  | string
  | number
  | boolean
  | null
  | Broadcastable[]
