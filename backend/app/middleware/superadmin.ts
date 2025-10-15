import { E_FORBIDDEN_ACCESS } from '#exceptions/errors'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Middleware: SuperAdminMiddleware
 * @description Ensures that the user has superadmin privileges
 */
export default class SuperAdminMiddleware {
  async handle({ auth }: HttpContext, next: () => Promise<void>) {
    // Check if user is authenticated
    if (!auth.isAuthenticated || !auth.user) {
      throw new E_FORBIDDEN_ACCESS('you need to be authenticated to perform this action')
    }

    // Check if user has superadmin role
    if (!auth.user.isSuperAdmin) {
      throw new E_FORBIDDEN_ACCESS(
        'you do not have the necessary permissions to access this resource'
      )
    }

    // Continue to the next middleware or route handler
    await next()
  }
}
