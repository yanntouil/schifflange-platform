import WorkspaceLog from '#models/workspace-log'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupOldWorkspaceLogsJob extends BaseJob {
  async run() {
    // Keep workspace logs for 6 months
    const cutoffDate = DateTime.now().minus({ months: 6 })

    // Find old workspace logs
    const oldLogs = await WorkspaceLog.query()
      .where('createdAt', '<', cutoffDate.toSQL())

    let deletedCount = 0
    for (const log of oldLogs) {
      try {
        await log.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error deleting old workspace log:', error, {
          logId: log.id,
          workspaceId: log.workspaceId,
          event: log.event
        })
      }
    }

    logger.info(`Cleaned up ${deletedCount} old workspace logs (older than 6 months)`)
    return { deleted: deletedCount }
  }
}