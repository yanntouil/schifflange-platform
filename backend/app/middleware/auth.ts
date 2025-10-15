import { E_UNAUTHORIZED_ACCESS } from '#exceptions/auth'
import type { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import assert from 'assert'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards)
    assert(
      ctx.auth.user,
      new E_UNAUTHORIZED_ACCESS('You must be logged in to access this resource')
    )
    await ctx.auth.user.preloadMe()

    return next()
  }
}
