import SecurityLog from '#models/security-log'
import SecurityLogService from '#services/security-log'
import { filterSecurityLogsValidator } from '#validators/admin/security-logs'
import { HttpContext } from '@adonisjs/core/http'
import { A } from '@mobily/ts-belt'

/**
 * Controller: SecurityLogsController
 * @description this controller contains methods to manage security logs (admin only)
 */
export default class SecurityLogsController {
  /**
   * index
   * Returns a paginated list of security logs
   * @get admin/security-logs
   * @middleware auth, admin
   * @query { page?: number, limit?: number, userId?: string, event?: string, ipAddress?: string, dateFrom?: string, dateTo?: string }
   * @success 200 { data: SecurityLog[], meta: PaginationMeta }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   */
  public async index({ request, response }: HttpContext) {
    const [page, limit] = await request.pagination()
    const search = await request.search()
    const filterBy = await request.filterBy(filterSecurityLogsValidator)
    const logs = await SecurityLogService.getAllLogs(limit, page, filterBy, search)

    return response.ok({
      logs: A.map(logs.all(), (log) => log.serialize()),
      metadata: logs.getMeta(),
    })
  }

  /**
   * show
   * Returns a specific security log
   * @get admin/security-logs/:id
   * @middleware auth, admin
   * @params { id: string }
   * @success 200 { data: SecurityLog }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_NOT_FOUND
   */
  public async show({ params, response }: HttpContext) {
    const log = await SecurityLog.findOrFail(params.id)

    return response.ok({
      log: log.serialize(),
    })
  }

  /**
   * userLogs
   * Returns security logs for a specific user
   * @get admin/users/:userId/security-logs
   * @middleware auth, admin
   * @params { userId: string }
   * @query { page?: number, limit?: number }
   * @success 200 { data: SecurityLog[], meta: PaginationMeta }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_USER_NOT_FOUND
   */
  public async userLogs({ params, request, response }: HttpContext) {
    const { userId } = params
    const [page, limit] = await request.pagination()
    const search = await request.search()
    const filterBy = await request.filterBy(filterSecurityLogsValidator)
    const logs = await SecurityLogService.getUserLogs(userId, limit, page, filterBy, search)

    return response.ok({
      logs: A.map(logs.all(), (log) => log.serialize()),
      metadata: logs.getMeta(),
    })
  }
}
