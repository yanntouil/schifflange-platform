import env from '#start/env'
import limiter from '@adonisjs/limiter/services/main'

export default class LimiterService {
  /**
   * defaultThrottle
   * Allow requests to the default limit
   */
  public defaultThrottle = limiter.define('global', () => {
    return limiter.allowRequests(env.get('LIMITER_DEFAULT_LIMIT')).every('1 minute')
  })

  /**
   * throttle
   * Allow requests to the custom limit
   */
  public throttle = (
    requests: number = env.get('LIMITER_AUTH_LIMIT'),
    duration: string | number = '1 minute'
  ) =>
    limiter.define('custom', () => {
      return limiter.allowRequests(requests).every(duration)
    })

  /**
   * apiThrottle
   * Allow requests to the api limit
   */
  public apiThrottle = limiter.define('api', (ctx) => {
    if (ctx.auth.user) {
      return limiter
        .allowRequests(env.get('LIMITER_AUTH_LIMIT'))
        .every('1 minute')
        .usingKey(`user_${ctx.auth.user.id}`)
    }
    return limiter
      .allowRequests(env.get('LIMITER_DEFAULT_LIMIT'))
      .every('1 minute')
      .usingKey(`ip_${ctx.request.ip()}`)
  })

  /**
   * riskedThrottle
   * Allow requests to the risked limit
   */
  public riskedThrottle = limiter.define('risked', () => {
    return limiter.allowRequests(env.get('LIMITER_RISKED_LIMIT')).every('1 minute')
  })
}
