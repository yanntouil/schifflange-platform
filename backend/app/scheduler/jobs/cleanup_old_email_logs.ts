import EmailLog from '#models/email-log'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupOldEmailLogsJob extends BaseJob {
  async run() {
    const cutoffDate = DateTime.now().minus({ days: 90 })

    // Find email logs older than 90 days
    const oldLogs = await EmailLog.query()
      .where('createdAt', '<', cutoffDate.toSQL())

    let deletedCount = 0
    for (const log of oldLogs) {
      try {
        await log.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error deleting email log:', error)
      }
    }

    logger.info(`Cleaned up ${deletedCount} old email logs`)
    return { deleted: deletedCount }
  }
}