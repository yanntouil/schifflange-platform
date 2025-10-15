import env from '#start/env'
import { errors as authErrors } from '@adonisjs/auth'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import { HttpError } from '@adonisjs/core/types/http'
import { errors as limiterErrors } from '@adonisjs/limiter'
import { A, G } from '@mobily/ts-belt'
import { errors as vineErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = env.get('DEBUG')
  protected reportErrors = env.get('REPORT_ERRORS')

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (G.isObject(error) && G.isNumber(error.status)) ctx.response.status(error.status)

    const { response } = ctx
    if (error instanceof authErrors.E_INVALID_CREDENTIALS)
      return response.badRequest({
        name: 'E_INVALID_CREDENTIALS',
        message: error.message,
        status: error.status,
      })
    if (error instanceof limiterErrors.E_TOO_MANY_REQUESTS)
      return response.tooManyRequests({
        name: 'E_TOO_MANY_REQUESTS',
        message: `too many requests, please retry in ${error.response.availableIn} seconds`,
        status: 429,
      })
    if (error instanceof vineErrors.E_VALIDATION_ERROR)
      return response.badRequest({
        name: 'E_VALIDATION_FAILURE',
        message: 'some of your input is invalid, check your entries',
        status: 400,
        errors: A.map(error.messages, (e: { field: string; rule: string }) => ({
          field: e.field,
          rule: e.rule,
        })),
      })
    return super.handle(error, ctx)
  }

  /**
   * Renders an error to JSON response
   */
  async renderError(error: HttpError, ctx: HttpContext) {
    ctx.response.status(error.status)
    if (this.debug) return super.renderError(error, ctx)
    return ctx.response.json({
      name: error.code,
      message: error.message,
      status: error.status,
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
