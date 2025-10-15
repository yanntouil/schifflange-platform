import UserToken from '#models/user-token'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupExpiredTokensJob extends BaseJob {
  async run() {
    const now = DateTime.now()

    // Find explicitly expired tokens
    const explicitlyExpired = await UserToken.query()
      .where('expiresAt', '<', now.toSQL())

    // Find old tokens without expiration (older than 30 days)
    const oldTokens = await UserToken.query()
      .whereNull('expiresAt')
      .where('createdAt', '<', now.minus({ days: 30 }).toSQL())

    const allTokens = [...explicitlyExpired, ...oldTokens]

    for (const token of allTokens) {
      try {
        await token.delete()
      } catch (error) {
        logger.error('Error deleting token:', error)
      }
    }

    logger.info(`Cleaned up ${allTokens.length} expired tokens`)
    return { deleted: allTokens.length }
  }
}