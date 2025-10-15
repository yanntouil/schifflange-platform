import User from '#models/user'
import WorkspaceLog, { type WorkspaceEventType } from '#models/workspace-log'
import { Infer } from '#start/vine'
import { filterSecurityLogsValidator } from '#validators/admin/security-logs'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Option } from '@mobily/ts-belt/Option'

/**
 * Service: WorkspaceLogService
 * @description this service contains methods to log workspace-related events
 */
export default class WorkspaceLogService {
  /**
   * Log a security event
   */
  public static async log(
    event: WorkspaceEventType,
    ctx: HttpContext | null,
    user: User | null = null,
    metadata: Record<string, any> = {}
  ) {
    const workspaceId = ctx?.workspace?.id
    if (!workspaceId) {
      logger.error(
        { event, userId: user?.id ?? 'unknown' },
        'No workspace ID available for logging'
      )
      return
    }

    return this.createLog(event, workspaceId, ctx, user, metadata)
  }

  /**
   * Log a security event in admin context (with explicit workspace ID)
   */
  public static async logInAdmin(
    event: WorkspaceEventType,
    workspaceId: string,
    ctx: HttpContext | null,
    user: User | null = null,
    metadata: Record<string, any> = {}
  ) {
    return this.createLog(event, workspaceId, ctx, user, metadata)
  }

  /**
   * Protected method to create a workspace log entry
   */
  protected static async createLog(
    event: WorkspaceEventType,
    workspaceId: string,
    ctx: HttpContext | null,
    user: User | null = null,
    metadata: Record<string, any> = {}
  ) {
    try {
      const ipAddress = ctx?.request.ip() ?? 'unknown'
      const userId = user?.id ?? ctx?.auth.user?.id ?? null

      // Create log entry in database
      const workspaceLog = await WorkspaceLog.create({
        event: event,
        workspaceId: workspaceId,
        userId: userId,
        ipAddress: ipAddress,
        metadata: {
          ...metadata,
          userAgent: ctx?.request.header('user-agent') ?? 'unknown',
        },
      })

      // Also log to application logger for monitoring
      logger.info(
        {
          security: true,
          event,
          workspaceId,
          userId,
          ipAddress,
          ...metadata,
        },
        `Security event: ${event}`
      )

      return workspaceLog
    } catch (error) {
      // If logging fails, we don't want to break the application flow
      // Just log the error and continue
      logger.error(
        { error, event, workspaceId, userId: user?.id ?? 'unknown' },
        'Failed to create workspace log'
      )
    }
  }

  /**
   * Get all workspace logs with pagination and filtering
   */
  public static async getAllLogs(
    limit: number,
    page: number,
    filterBy: Infer<typeof filterSecurityLogsValidator>,
    search: Option<string>
  ) {
    const query = WorkspaceLog.query()
      .preload('user', (query) => {
        query.preload('profile')
      })
      .preload('workspace', (query) => {
        query.preload('profile')
      })
      .apply((scopes) => scopes.filterBy(filterBy))
      .apply((scopes) => scopes.search(search))
      .orderBy('createdAt', 'desc')

    return await query.paginate(page, limit)
  }

  /**
   * Get workspace logs for a specific workspace
   */
  public static async getWorkspaceLogs(
    workspaceId: string,
    limit: number,
    page: number,
    filterBy: Infer<typeof filterSecurityLogsValidator>,
    search: Option<string>
  ) {
    const query = WorkspaceLog.query()
      .where('workspaceId', workspaceId)
      .preload('user', (query) => {
        query.preload('profile')
      })
      .preload('workspace', (query) => {
        query.preload('profile')
      })
      .apply((scopes) => scopes.filterBy(filterBy))
      .apply((scopes) => scopes.search(search))
      .orderBy('createdAt', 'desc')

    return await query.paginate(page, limit)
  }
}
