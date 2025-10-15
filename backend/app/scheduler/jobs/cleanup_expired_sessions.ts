import UserSession from '#models/user-session'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupExpiredSessionsJob extends BaseJob {
  async run() {
    const cutoffDate = DateTime.now().minus({ days: 30 })

    // Find sessions that haven't been used in 30 days
    const expiredSessions = await UserSession.query()
      .where('lastUsedAt', '<', cutoffDate.toSQL())

    let deletedCount = 0
    for (const session of expiredSessions) {
      try {
        await session.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error deleting expired session:', error)
      }
    }

    logger.info(`Cleaned up ${deletedCount} expired sessions`)
    return { deleted: deletedCount }
  }
}