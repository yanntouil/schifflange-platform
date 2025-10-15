import User from '#models/user'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupInactiveAccountsJob extends BaseJob {
  async run() {
    const cutoffDate = DateTime.now().minus({ days: 30 })

    // Find unverified accounts older than 30 days
    const inactiveAccounts = await User.query()
      .where('isActive', false)
      .where('createdAt', '<', cutoffDate.toSQL())

    let deletedCount = 0
    for (const account of inactiveAccounts) {
      try {
        await account.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error deleting inactive account:', error)
      }
    }

    logger.info(`Cleaned up ${deletedCount} inactive accounts`)
    return { deleted: deletedCount }
  }
}