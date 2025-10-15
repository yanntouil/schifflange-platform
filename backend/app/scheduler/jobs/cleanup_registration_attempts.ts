import RegistrationAttempt from '#models/registration-attempt'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupRegistrationAttemptsJob extends BaseJob {
  async run() {
    const cutoffDate = DateTime.now().minus({ hours: 24 })

    // Find registration attempts older than 24 hours
    const oldAttempts = await RegistrationAttempt.query()
      .where('createdAt', '<', cutoffDate.toSQL())

    let deletedCount = 0
    for (const attempt of oldAttempts) {
      try {
        await attempt.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error deleting registration attempt:', error)
      }
    }

    logger.info(`Cleaned up ${deletedCount} old registration attempts`)
    return { deleted: deletedCount }
  }
}