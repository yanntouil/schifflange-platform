import SchedulerService from '#scheduler/scheduler_service'

// Import all jobs
import CleanupExpiredTokensJob from '#scheduler/jobs/cleanup_expired_tokens'
import CleanupInactiveAccountsJob from '#scheduler/jobs/cleanup_inactive_accounts'
import CleanupExpiredSessionsJob from '#scheduler/jobs/cleanup_expired_sessions'
import CleanupRegistrationAttemptsJob from '#scheduler/jobs/cleanup_registration_attempts'
import CleanupOldEmailLogsJob from '#scheduler/jobs/cleanup_old_email_logs'
import RetryFailedEmailsJob from '#scheduler/jobs/retry_failed_emails'
import CleanupOldNotificationsJob from '#scheduler/jobs/cleanup_old_notifications'
import RotateSecurityLogsJob from '#scheduler/jobs/rotate_security_logs'
import CleanupExpiredWorkspaceInvitationsJob from '#scheduler/jobs/cleanup_expired_workspace_invitations'
import CleanupOldWorkspaceLogsJob from '#scheduler/jobs/cleanup_old_workspace_logs'
import RotateAppLogsJob from '#scheduler/jobs/rotate_app_logs'

// Create scheduler instance
const scheduler = new SchedulerService()

// Add all jobs
scheduler.addJob({
  key: 'cleanup-expired-tokens',
  cronExpression: '0 0 * * *', // Daily at midnight
  job: new CleanupExpiredTokensJob(),
})

scheduler.addJob({
  key: 'cleanup-inactive-accounts',
  cronExpression: '0 0 * * *', // Daily at midnight
  job: new CleanupInactiveAccountsJob(),
})

scheduler.addJob({
  key: 'cleanup-expired-sessions',
  cronExpression: '0 0 * * *', // Daily at midnight
  job: new CleanupExpiredSessionsJob(),
})

scheduler.addJob({
  key: 'cleanup-registration-attempts',
  cronExpression: '0 0 * * *', // Daily at midnight
  job: new CleanupRegistrationAttemptsJob(),
})

scheduler.addJob({
  key: 'cleanup-old-email-logs',
  cronExpression: '0 2 15 * *', // 15th of each month at 2 AM
  job: new CleanupOldEmailLogsJob(),
})

scheduler.addJob({
  key: 'retry-failed-emails',
  cronExpression: '15 * * * *', // Every hour at 15 minutes
  job: new RetryFailedEmailsJob(),
})

scheduler.addJob({
  key: 'cleanup-old-notifications',
  cronExpression: '0 1 * * *', // Daily at 1 AM
  job: new CleanupOldNotificationsJob(),
})

scheduler.addJob({
  key: 'rotate-security-logs',
  cronExpression: '0 0 * * 0', // Sunday at midnight
  job: new RotateSecurityLogsJob(),
})

scheduler.addJob({
  key: 'cleanup-expired-workspace-invitations',
  cronExpression: '0 3 * * *', // Daily at 3 AM
  job: new CleanupExpiredWorkspaceInvitationsJob(),
})

scheduler.addJob({
  key: 'cleanup-old-workspace-logs',
  cronExpression: '0 4 1 * *', // Monthly on 1st day at 4 AM
  job: new CleanupOldWorkspaceLogsJob(),
})

scheduler.addJob({
  key: 'rotate-app-logs',
  cronExpression: '59 23 * * *', // Daily at 23:59 (just before midnight)
  job: new RotateAppLogsJob(),
})

// Start all jobs
scheduler.scheduleAllJobs()

// Export for potential manual access
export default scheduler