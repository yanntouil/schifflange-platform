import { E_UNAUTHORIZED_ACCESS } from '#exceptions/errors'
import UserSession from '#models/user-session'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

/**
 * Middleware: CheckActiveSessionMiddleware
 * @description Ensures that the user's session is active
 */
export default class CheckActiveSessionMiddleware {
  async handle({ auth, session }: HttpContext, next: () => Promise<void>) {
    // Check if user is authenticated
    if (!auth.isAuthenticated || !auth.user) {
      throw new E_UNAUTHORIZED_ACCESS('You must be logged in to access this resource')
    }

    // Check if the session is active
    const userSession = await UserSession.query()
      .where('userId', auth.user.id)
      .where('token', session.sessionId)
      .where('isActive', true)
      .first()

    if (!userSession) {
      // Session is not active, log the user out
      await auth.use('web').logout()
      throw new E_UNAUTHORIZED_ACCESS('Your session is no longer active')
    }

    // Update the last activity timestamp
    await userSession.merge({ lastActivity: DateTime.now() }).save()

    // Continue to the next middleware or route handler
    await next()
  }
}
