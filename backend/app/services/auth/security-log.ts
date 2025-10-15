import SecurityLog, { type SecurityEventType } from '#models/security-log'
import User from '#models/user'
import { Infer } from '#start/vine'
import { filterSecurityLogsValidator } from '#validators/admin/security-logs'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Option } from '@mobily/ts-belt/Option'

/**
 * Service: SecurityLogService
 * @description this service contains methods to log security-related events
 */
export default class SecurityLogService {
  /**
   * Log a security event
   */
  public static async log(
    event: SecurityEventType,
    ctx: HttpContext | null,
    user: User | null = null,
    metadata: Record<string, any> = {}
  ) {
    try {
      const ipAddress = ctx?.request.ip() ?? 'unknown'
      const userId = user?.id ?? ctx?.auth.user?.id ?? null

      // Create log entry in database
      const securityLog = new SecurityLog()
      securityLog.event = event
      securityLog.userId = userId
      securityLog.ipAddress = ipAddress
      securityLog.metadata = {
        ...metadata,
        userAgent: ctx?.request.header('user-agent') ?? 'unknown',
      }

      await securityLog.save()

      // Also log to application logger for monitoring
      logger.info(
        {
          security: true,
          event,
          userId,
          ipAddress,
          ...metadata,
        },
        `Security event: ${event}`
      )

      return securityLog
    } catch (error) {
      // If logging fails, we don't want to break the application flow
      // Just log the error and continue
      logger.error('Failed to create security log:', error, { event, userId: user?.id ?? 'unknown' })
    }
  }

  /**
   * Get security logs for a user
   */
  public static async getUserLogs(
    userId: string,
    limit = 50,
    page = 1,
    filters: Infer<typeof filterSecurityLogsValidator> = {},
    search: Option<string> = null
  ) {
    return SecurityLog.query()
      .where('userId', userId)
      .withScopes((scope) => scope.filterBy(filters))
      .withScopes((scope) => scope.search(search))
      .orderBy('createdAt', 'desc')
      .preload('user', (query) => query.preload('profile'))
      .paginate(page, limit)
  }

  /**
   * Get all security logs (for admin)
   */
  public static async getAllLogs(
    limit = 50,
    page = 1,
    filters: Infer<typeof filterSecurityLogsValidator> = {},
    search: Option<string> = null
  ) {
    return SecurityLog.query()
      .withScopes((scope) => scope.filterBy(filters))
      .withScopes((scope) => scope.search(search))
      .orderBy('createdAt', 'desc')
      .preload('user', (query) => query.preload('profile'))
      .paginate(page, limit)
  }
}
