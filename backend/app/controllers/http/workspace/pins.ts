import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Library from '#models/library'
import Organisation from '#models/organisation'
import { validationFailure } from '#start/vine'
import { reorderPinsValidator, updatePinValidator } from '#validators/pins'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { match } from 'ts-pattern'

/**
 * PinsController
 */
export default class PinsController {
  /**
   * update
   * update the pin of a collection item
   * @put workspaces/:workspaceId/pins/:collections/:collectionId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { content: Content }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, request, response }: HttpContext) {
    const Model = getModel(request)
    const item = await Model.query()
      .where('id', request.param('collectionId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(item)) throw E_RESOURCE_NOT_FOUND

    const payload = await request.validateUsing(updatePinValidator)

    if (G.isNotNullable(payload.pin) && payload.pin !== item.pin) {
      if (payload.pin === true) {
        // Pin: add to the end of the list
        const pinnedItems = await Model.query()
          .where('workspaceId', workspace.id)
          .where('pin', true)
          .orderBy('pin_order', 'desc')

        const maxOrder = A.head(pinnedItems)?.pinOrder ?? -1
        item.pin = true
        item.pinOrder = maxOrder + 1
      } else {
        // Unpin: reorder remaining items
        item.pin = false
        item.pinOrder = 0
        await item.save()

        // Reorder remaining pinned items
        const remainingPinned = await Model.query()
          .where('workspaceId', workspace.id)
          .where('pin', true)
          .orderBy('pin_order', 'asc')

        await Promise.all(
          A.mapWithIndex(remainingPinned, (pinOrder, pinnedItem) =>
            pinnedItem.merge({ pinOrder }).save()
          )
        )
      }
      // save item after update
      await item.save()
    }

    response.ok({
      pin: {
        id: item.id,
        pin: item.pin,
        pinOrder: item.pinOrder,
      },
    })
  }

  /**
   * reorderPins
   * reorder pins in a collection
   * @put workspaces/:workspaceId/pins/:collections
   * @middleware authActive workspace({as 'member'})
   * @success 200 { sortedIds: string[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async reorderItems({ workspace, request, response }: HttpContext) {
    const Model = getModel(request)

    const items = await Model.query().where('workspaceId', workspace.id).andWhere('pin', true)

    const { pins: sortedIds } = await request.validateUsing(reorderPinsValidator)

    if (!A.every(items, ({ id }) => A.includes(sortedIds, id)))
      return response.badRequest(validationFailure([{ field: 'pins', rule: 'exist' }]))

    // reorder items
    await Promise.all(
      A.mapWithIndex(sortedIds, (pinOrder, id) =>
        A.find(items, (item) => item.id === id)
          ?.merge({ pinOrder })
          .save()
      )
    )

    response.ok({ sortedIds })
  }
}

/**
 * related model bridge
 */
const getModel = (request: HttpContext['request']) => {
  return match(request.param('collections'))
    .with('organisations', () => Organisation)
    .with('libraries', () => Library)
    .otherwise(() => {
      throw new Error('Model not found')
    })
}
