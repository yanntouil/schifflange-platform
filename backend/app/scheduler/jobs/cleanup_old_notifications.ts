import Notification from '#models/notification'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupOldNotificationsJob extends BaseJob {
  async run() {
    const now = DateTime.now()
    let totalDeleted = 0

    // 1. Clean up expired notifications
    const expiredNotifications = await Notification.query()
      .whereNotNull('expiresAt')
      .where('expiresAt', '<', now.toSQL())

    for (const notification of expiredNotifications) {
      try {
        await notification.delete()
        totalDeleted++
      } catch (error) {
        logger.error('Error deleting expired notification:', error)
      }
    }

    // 2. Clean up old read notifications (30 days)
    const oldReadNotifications = await Notification.query()
      .where('status', 'read')
      .whereNotNull('deliveredAt')
      .where('deliveredAt', '<', now.minus({ days: 30 }).toSQL())

    for (const notification of oldReadNotifications) {
      try {
        await notification.delete()
        totalDeleted++
      } catch (error) {
        logger.error('Error deleting old read notification:', error)
      }
    }

    // 3. Clean up very old notifications (90 days)
    const veryOldNotifications = await Notification.query()
      .where('createdAt', '<', now.minus({ days: 90 }).toSQL())

    for (const notification of veryOldNotifications) {
      try {
        await notification.delete()
        totalDeleted++
      } catch (error) {
        logger.error('Error deleting very old notification:', error)
      }
    }

    logger.info(`Cleaned up ${totalDeleted} old notifications`)
    return { deleted: totalDeleted }
  }
}