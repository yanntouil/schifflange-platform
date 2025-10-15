import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import EmailLog from '#models/email-log'
import MailService from '#services/mail'
import { filterEmailLogsValidator } from '#validators/email-logs'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'

/**
 * EmailLogsController
 * @description Controller for managing email logs
 */
export default class EmailLogsController {
  /**
   * index
   * Returns a paginated list of email logs
   * @get admin/email-logs
   * @middleware auth, admin
   * @query { page?: number, limit?: number, filterBy?: { status?: string, email?: string, template?: string } }
   * @success 200 { mails: EmailLog[], metadata: PaginatedMetadata }
   */
  public async index({ request, response }: HttpContext) {
    const pagination = await request.pagination()
    const filterBy = await request.filterBy(filterEmailLogsValidator)

    const paginated = await EmailLog.query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .orderBy('createdAt', 'desc')
      // .paginate(...pagination)
      .paginate(pagination[0], 1000000)

    return response.ok({
      emails: A.map(paginated.all(), (log) => log.serialize()),
      metadata: paginated.getMeta(),
    })
  }

  /**
   * show
   * Returns a specific email log
   * @get admin/email-logs/:id
   * @middleware auth, admin
   * @params { id: string }
   * @success 200 { mail: EmailLog }
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async show({ params, response }: HttpContext) {
    const log = await EmailLog.query().where('id', params.id).preload('user').first()
    if (G.isNullable(log)) {
      throw E_RESOURCE_NOT_FOUND
    }
    return response.ok({
      email: log.serialize(),
    })
  }

  /**
   * preview
   * Returns a specific email log preview in html format
   * @get admin/email-logs/:id/preview
   * @middleware auth, admin
   * @params { id: string }
   * @success 200
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async preview({ params, response }: HttpContext) {
    const log = await EmailLog.query().where('id', params.id).preload('user').first()
    if (G.isNullable(log)) {
      throw E_RESOURCE_NOT_FOUND
    }
    try {
      const preview = await MailService.preview(log)
      if (G.isNullable(preview)) {
        throw E_RESOURCE_NOT_FOUND
      }
      return response.ok({ preview })
    } catch (error) {
      throw E_RESOURCE_NOT_FOUND
    }
  }

  /**
   * resend
   * Resends an email
   * @post admin/email-logs/:id/resend
   * @middleware auth, admin
   * @params { id: string }
   * @success 200 { mail: EmailLog }
   * @error 404 E_ROW_NOT_FOUND
   */
  public async resend({ params, response }: HttpContext) {
    const log = await MailService.resend(params.id)
    if (G.isNullable(log)) {
      throw E_RESOURCE_NOT_FOUND
    }
    return response.ok({
      email: log.serialize(),
    })
  }
}
