/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#middleware/container-bindings'),
  () => import('#middleware/force-json-response'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/static/static_middleware')
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/session/session_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
  () => import('#middleware/transaction'),
])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({
  guest: () => import('#middleware/guest'),
  auth: () => import('#middleware/auth'),
  silentAuth: () => import('#middleware/silent-auth'),
  checkActiveSession: () => import('#middleware/check-active-session'),
  admin: () => import('#middleware/admin'),
  superadmin: () => import('#middleware/superadmin'),
  workspace: () => import('#middleware/workspace'),
  siteWorkspace: () => import('#middleware/site-workspace'),
})
