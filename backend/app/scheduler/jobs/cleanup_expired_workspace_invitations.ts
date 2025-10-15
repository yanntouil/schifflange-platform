import WorkspaceInvitation from '#models/workspaces-invitation'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class CleanupExpiredWorkspaceInvitationsJob extends BaseJob {
  async run() {
    const now = DateTime.now()

    // Find expired invitations
    const expiredInvitations = await WorkspaceInvitation.query()
      .whereNotNull('expiresAt')
      .where('expiresAt', '<', now.toSQL())

    let deletedCount = 0
    for (const invitation of expiredInvitations) {
      try {
        await invitation.delete()
        deletedCount++
      } catch (error) {
        logger.error('Error deleting expired workspace invitation:', error, {
          invitationId: invitation.id,
          email: invitation.email
        })
      }
    }

    logger.info(`Cleaned up ${deletedCount} expired workspace invitations`)
    return { deleted: deletedCount }
  }
}