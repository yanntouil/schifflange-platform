import { HttpContext } from '@adonisjs/core/http'
import { A, D, pipe } from '@mobily/ts-belt'

/**
 * requestToCacheKey
 * @description Generate a unique key for the request
 */
export const requestToCacheKey = (request: HttpContext['request']) =>
  pipe(
    request.params(),
    D.merge(request.qs()),
    D.toPairs,
    A.map(([k, v]) => `${k}=${v}`),
    A.join('|')
  )
