import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { withContent } from '#models/content'
import Event, { preloadEvent } from '#models/event'
import { withEventCategories } from '#models/event-category'
import { withEventTranslations } from '#models/event-translation'
import { withPublication } from '#models/publication'
import { withSchedule } from '#models/schedule'
import { withSeo } from '#models/seo'
import { withSlug } from '#models/slug'
import { withVisits } from '#models/tracking'
import { withCreatedBy, withUpdatedBy } from '#models/user'
import { validationFailure } from '#start/vine'
import {
  createEventValidator,
  filterEventsByValidator,
  sortEventsByValidator,
  updateEventValidator,
} from '#validators/events'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * EventsController
 */
export default class EventsController {
  /**
   * all
   * @get workspaces/:workspaceId/events
   * @middleware authActive workspace({as 'member'})
   * @success 200 { events: Event[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterEventsByValidator)
    const sortBy = await request.sortBy(sortEventsByValidator)
    const limit = await request.limit()
    const events = await workspace
      .related('events')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload(...withSeo())
      .preload(...withContent())
      .preload(...withEventCategories())
      .preload(...withSlug())
      .preload(...withVisits())
      .preload(...withEventTranslations())
      .preload(...withSchedule())
      .preload(...withPublication())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
    return response.ok({ events: A.map(events, (event) => event.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/events
   * @middleware authActive workspace({as 'member'})
   * @success 201 { event: Event }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { categoryIds, ...payload } = await request.validateUsing(createEventValidator)
    const now = DateTime.now()

    // check if categories exist in workspace
    if (G.isNotNullable(categoryIds) && A.isNotEmpty(categoryIds)) {
      const categories = await workspace
        .related('eventCategories')
        .query()
        .whereIn('id', categoryIds)
      if (A.length(categories) !== A.length(categoryIds))
        return response.badRequest(validationFailure([{ field: 'categoryIds', rule: 'exist' }]))
    }

    const event = await workspace.related('events').create({
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    // Attach categories
    if (G.isNotNullable(categoryIds) && categoryIds.length > 0) {
      await event.related('categories').attach(categoryIds)
    }

    await event.load(preloadEvent)
    return response.ok({ event: event.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/events/:eventId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { event: Event }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const event = await workspace
      .related('events')
      .query()
      .where('id', request.param('eventId'))
      .preload(...withSeo())
      .preload(...withContent())
      .preload(...withEventCategories())
      .preload(...withSlug())
      .preload(...withVisits())
      .preload(...withEventTranslations())
      .preload(...withSchedule())
      .preload(...withPublication())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()
    if (G.isNullable(event)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ event: event.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/events/:eventId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { event: Event }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const event = await workspace
      .related('events')
      .query()
      .where('id', request.param('eventId'))
      .first()
    if (G.isNullable(event)) throw E_RESOURCE_NOT_FOUND

    const { categoryIds, ...payload } = await request.validateUsing(updateEventValidator)
    const now = DateTime.now()

    if (G.isNotNullable(categoryIds)) {
      // check if categories exist in workspace
      if (A.isNotEmpty(categoryIds)) {
        const categories = await workspace
          .related('eventCategories')
          .query()
          .whereIn('id', categoryIds)
        if (A.length(categories) !== A.length(categoryIds))
          return response.badRequest(validationFailure([{ field: 'categoryIds', rule: 'exist' }]))
      }
      // Sync categories
      await event.related('categories').sync(categoryIds)
    }

    await event
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await event.load(preloadEvent)

    return response.ok({ event: event.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/events/:eventId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const event = await Event.query()
      .where('id', request.param('eventId'))
      .andWhere('workspaceId', workspace.id)
      .first()
    if (G.isNullable(event)) throw E_RESOURCE_NOT_FOUND

    await event.delete()

    return response.noContent()
  }
}
