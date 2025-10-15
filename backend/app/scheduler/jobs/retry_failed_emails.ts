import EmailLog from '#models/email-log'
import { BaseJob } from '#types/job'
import logger from '@adonisjs/core/services/logger'
import MailService from '#services/email/mail'
import { DateTime } from 'luxon'

export default class RetryFailedEmailsJob extends BaseJob {
  async run() {
    const cutoffDate = DateTime.now().minus({ hours: 24 })

    // Find failed emails from the last 24 hours with less than 3 attempts
    const failedEmails = await EmailLog.query()
      .where('status', 'failed')
      .where('createdAt', '>', cutoffDate.toSQL())
      .where('retryAttempts', '<', 3)

    let retriedCount = 0
    let succeededCount = 0

    for (const emailLog of failedEmails) {
      try {
        // Use the MailService.resend method to actually retry the email
        const result = await MailService.resend(emailLog.id)

        if (result && result.status === 'sent') {
          succeededCount++
        }
        retriedCount++
      } catch (error) {
        logger.error('Error retrying email:', error, { emailId: emailLog.id })
      }
    }

    logger.info(`Retried ${retriedCount} failed emails, ${succeededCount} succeeded`)
    return { retried: retriedCount, succeeded: succeededCount }
  }
}