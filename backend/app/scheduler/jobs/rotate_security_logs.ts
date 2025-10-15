import SecurityLog from '#models/security-log'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class RotateSecurityLogsJob extends BaseJob {
  async run() {
    const cutoffDate = DateTime.now().minus({ days: 90 })

    // For now, just delete old security logs
    // In a real implementation, you'd archive them first
    const oldLogs = await SecurityLog.query()
      .where('createdAt', '<', cutoffDate.toSQL())

    let deletedCount = 0
    for (const log of oldLogs) {
      try {
        await log.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error rotating security log:', error)
      }
    }

    logger.info(`Rotated ${deletedCount} old security logs`)
    return { deleted: deletedCount }
  }
}