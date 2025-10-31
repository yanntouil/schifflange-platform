import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { updateCategoryTranslation, withEventCount } from '#models/event'
import EventCategory, { preloadEventCategory } from '#models/event-category'
import { withEventCategoryTranslations } from '#models/event-category-translation'
import { preloadFiles } from '#models/media-file'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import {
  createEventCategoryValidator,
  filterEventCategoriesByValidator,
  sortEventCategoriesByValidator,
  updateEventCategoryValidator,
} from '#validators/events'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * EventCategoriesController
 */
export default class EventCategoriesController {
  /**
   * all
   * @get workspaces/:workspaceId/events/categories
   * @middleware authActive workspace({as 'member'})
   * @success 200 { categories: EventCategory[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterEventCategoriesByValidator)
    const sortBy = await request.sortBy(sortEventCategoriesByValidator)
    const limit = await request.limit()

    const categories = await EventCategory.query()
      .where('workspaceId', workspace.id)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('translations', (query) => query.preload('image', preloadFiles))
      .withCount('events', (query) => query.as('totalEvents'))
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .orderBy('order', 'desc')
    return response.ok({ categories: A.map(categories, (category) => category.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/events/categories
   * @middleware authActive workspace({as 'member'})
   * @success 201 { category: EventCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, ...payload } = await request.validateUsing(createEventCategoryValidator)
    const now = DateTime.now()

    const category = await EventCategory.create({
      workspaceId: workspace.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await category.refresh()
    await updateCategoryTranslation(category, translations)
    await category.load(preloadEventCategory)
    return response.ok({ category: category.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/events/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: EventCategory }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const category = await EventCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .preload(...withEventCategoryTranslations())
      .withCount(...withEventCount())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ category: category.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/events/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { category: EventCategory }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const category = await EventCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .withCount(...withEventCount())
      .preload(...withEventCategoryTranslations())
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    const { translations, ...payload } = await request.validateUsing(updateEventCategoryValidator)
    const now = DateTime.now()
    await updateCategoryTranslation(category, translations)

    await category
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()
    await category.load(preloadEventCategory)

    return response.ok({ category: category.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/events/categories/:categoryId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const category = await EventCategory.query()
      .where('id', request.param('categoryId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(category)) throw E_RESOURCE_NOT_FOUND

    await category.delete()

    return response.noContent()
  }
}
