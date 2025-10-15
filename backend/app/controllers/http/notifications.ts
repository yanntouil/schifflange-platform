import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Notification from '#models/notification'
import {
  filterNotificationsValidator,
  sortNotificationsByValidator,
} from '#validators/notifications'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Controller: NotificationsController
 * @description this controller contains the methods to manage user notifications
 */
export default class NotificationsController {
  /**
   * index
   * Get all notifications for the authenticated user
   * @get auth/notifications
   * @middleware auth
   * @success 200 { notifications: Notification[] }
   */
  public async index(ctx: HttpContext) {
    const { auth, response, request } = ctx
    const pagination = await request.pagination()
    const filterBy = await request.filterBy(filterNotificationsValidator)
    const sortBy = await request.sortBy(sortNotificationsByValidator)
    const user = auth.user!

    const notifications = await user
      .related('notifications')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .preload('workspace')
      .preload('user', (query) => query.preload('profile'))
      .paginate(...pagination)

    const result = A.head(
      await db.from('notifications').where('user_id', user.id).count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0

    return response.ok({
      notifications: A.map(notifications.all(), (n) => n.serializeWithModel()),
      metadata: notifications.getMeta(),
      total,
    })
  }

  /**
   * markAsRead
   * Mark a specific notification as read
   * @put auth/notifications/:id
   * @middleware auth
   * @success 200 { notification: Notification }
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async markAsRead(ctx: HttpContext) {
    const { auth, params, response } = ctx
    const user = auth.user!

    const notification = await user.related('notifications').query().where('id', params.id).first()

    if (!notification) throw new E_RESOURCE_NOT_FOUND({ message: 'Notification not found' })

    notification.status = 'read'
    notification.deliveredAt = DateTime.now()
    await notification.save()

    return response.ok({
      notification: notification.serialize(),
    })
  }

  /**
   * markAllAsRead
   * Mark all notifications as read for the authenticated user
   * @put auth/notifications/mark-all-read
   * @middleware auth
   * @success 200 { updated: number }
   */
  public async markAllAsRead(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.user!

    const [updated] = await user.related('notifications').query().where('status', 'unread').update({
      status: 'read',
      deliveredAt: DateTime.now().toSQL(),
      updatedAt: DateTime.now().toSQL(),
    })

    return response.ok({
      updated,
    })
  }

  /**
   * destroy
   * Delete a specific notification
   * @delete auth/notifications/:id
   * @middleware auth
   * @success 200 { message: string }
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async destroy(ctx: HttpContext) {
    const { auth, params, response } = ctx
    const user = auth.user!

    const notification = await user.related('notifications').query().where('id', params.id).first()

    if (!notification) throw new E_RESOURCE_NOT_FOUND({ message: 'Notification not found' })

    await notification.delete()

    return response.ok({
      message: 'Notification deleted successfully',
    })
  }

  /**
   * destroyAll
   * Delete all notifications for the authenticated user
   * @delete auth/notifications
   * @middleware auth
   * @success 200 { deleted: number }
   */
  public async destroyAll(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.user!

    const notifications = await Notification.query().where('user_id', user.id)

    const deleted = notifications.length

    for (const notification of notifications) {
      await notification.delete()
    }

    return response.ok({
      deleted,
    })
  }
}
