import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Trace from '#models/trace'
import Tracking from '#models/tracking'
import Workspace from '#models/workspace'
import { randomRange, tracesSeeder } from '#services/tracking/seeder'
import { updateTracker } from '#services/tracking/service'
import {
  compactByBrowser,
  compactByDay,
  compactByDevice,
  compactByHour,
  compactByMonth,
  compactByOs,
  compactByWeek,
  compactByYear,
  uniqByUser,
} from '#services/tracking/utils'
import env from '#start/env'
import { requestToCacheKey } from '#utils/cache'
import { tryOrUndefinedSync } from '#utils/try-catch'
import { dateOrIntervalValidator } from '#validators/dates'
import { traceValidator } from '#validators/trackings'
import cache from '@adonisjs/cache/services/main'
import { HttpContext } from '@adonisjs/core/http'
import { G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * cache
 */
const cacheOptions = { ttl: env.get('NODE_ENV') === 'development' ? '1s' : '120s' }

/**
 * TrackingsController
 */
export default class TrackingsController {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SEEDER
   */
  public async seed({ request, response }: HttpContext) {
    const tracking = await Tracking.query().where('id', request.param('trackingId')).first()
    if (G.isNullable(tracking)) throw E_RESOURCE_NOT_FOUND
    let created = 0
    await tracesSeeder(
      tracking.id,
      tracking.workspaceId,
      // 4 years ago to now
      DateTime.now().minus({ years: 2 }),
      365 * 4,
      randomRange(100, 3000),
      () => created++
    )
    return response.ok({ message: `${created} traces created` })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * WORKSPACE TRACES
   */

  /**
   * tracesStats
   * @get tracking/traces
   * @qs { type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesStats({ request, response, workspace }: HttpContext) {
    const { isBot, trackingIds } = parseQs(request)
    const now = DateTime.now()

    const stats = await cache.getOrSet({
      key: 'tracesStats' + requestToCacheKey(request),
      factory: async () => {
        // count all traces
        const total = await Trace.query()
          .withScopes((scope) => scope.workspace(workspace))
          .whereIn('trackingId', trackingIds)
          .count('id', 'count')
          .first()

        // get traces from 1 month ago
        const dates = {
          from: now.minus({ months: 1 }).toJSDate(),
          to: now.toJSDate(),
          date: undefined,
        }
        const traces = await getTraces({ workspace, dates, isBot, trackingIds })
        const lastMonth = traces.length

        // count traces from today
        const today = traces.filter(
          (trace) => trace.createdAt.toFormat('yyyy-MM-dd') === now.toFormat('yyyy-MM-dd')
        ).length

        // count traces from last 7 days
        const last7Days = traces.filter((trace) => trace.createdAt > now.minus({ days: 7 })).length

        return { today, last7Days, lastMonth, ever: total?.$extras.count ?? 0 }
      },
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByBrowser
   * @get tracking/traces/browser
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByBrowser({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByBrowser' + requestToCacheKey(request),
      factory: async () =>
        compactByBrowser(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByDevice
   * @get tracking/traces/device
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByDevice({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByDevice' + requestToCacheKey(request),
      factory: async () =>
        compactByDevice(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })

    return response.ok({ stats })
  }

  /**
   * tracesByOs
   * @get tracking/traces/os
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByOs({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByOs' + requestToCacheKey(request),
      factory: async () =>
        compactByOs(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByHour
   * @get tracking/traces/hour
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByHour({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByHour' + requestToCacheKey(request),
      factory: async () =>
        compactByHour(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByDay
   * @get tracking/traces/day
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByDay({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByDay' + requestToCacheKey(request),
      factory: async () =>
        compactByDay(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByWeek
   * @get tracking/traces/month
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByWeek({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByWeek' + requestToCacheKey(request),
      factory: async () =>
        compactByWeek(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByMonth
   * @get tracking/traces/month
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByMonth({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByMonth' + requestToCacheKey(request),
      factory: async () =>
        compactByMonth(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * tracesByYear
   * @get tracking/traces/year
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async tracesByYear({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'tracesByYear' + requestToCacheKey(request),
      factory: async () =>
        compactByYear(uniqByUser(await getTraces({ workspace, dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * WORKSPACE TRACKINGS
   */

  /**
   * trackingStats
   * @get tracking/:trackingId
   * @qs { isBot?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingStats({ request, response, workspace }: HttpContext) {
    const { isBot } = parseQs(request)
    const now = DateTime.now()
    const stats = await cache.getOrSet({
      key: 'trackingStats' + requestToCacheKey(request),
      factory: async () => {
        const total = await Trace.query()
          .withScopes((scope) => scope.workspace(workspace))
          .where('trackingId', request.param('trackingId'))
          .count('id', 'count')
          .first()
        const traces = await Trace.query()
          .withScopes((scope) => scope.workspace(workspace))
          .withScopes((scope) =>
            scope.whereDateOrInterval({
              from: now.minus({ months: 1 }),
              to: now,
            })
          )
          .where('isBot', isBot)
          .andWhere('trackingId', request.param('trackingId'))
        const today = traces.filter(
          (trace) => trace.createdAt.toFormat('yyyy-MM-dd') === now.toFormat('yyyy-MM-dd')
        ).length
        const last7Days = traces.filter((trace) => trace.createdAt > now.minus({ days: 7 })).length
        const lastMonth = traces.length
        return { today, last7Days, lastMonth, ever: total?.$extras.count ?? 0 }
      },
      ...cacheOptions,
    })

    return response.ok({ stats })
  }

  /**
   * trackingByBrowser
   * @get tracking/:trackingId/browser
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByBrowser({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByBrowser' + requestToCacheKey(request),
      factory: async () =>
        compactByBrowser(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByDevice
   * @get tracking/:trackingId/device
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByDevice({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByDevice' + requestToCacheKey(request),
      factory: async () =>
        compactByDevice(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByOs
   * @get tracking/:trackingId/os
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByOs({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByOs' + requestToCacheKey(request),
      factory: async () =>
        compactByOs(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByHour
   * @get tracking/:trackingId/hour
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByHour({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByHour' + requestToCacheKey(request),
      factory: async () =>
        compactByHour(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByDay
   * @get tracking/:trackingId/day
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByDay({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByDay' + requestToCacheKey(request),
      factory: async () =>
        compactByDay(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByWeek
   * @get tracking/:trackingId/week
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByWeek({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByWeek' + requestToCacheKey(request),
      factory: async () =>
        compactByWeek(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByMonth
   * @get tracking/:trackingId/month
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByMonth({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByMonth' + requestToCacheKey(request),
      factory: async () =>
        compactByMonth(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * trackingByYear
   * @get tracking/:trackingId/year
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async trackingByYear({ request, response, workspace }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'trackingByYear' + requestToCacheKey(request),
      factory: async () =>
        compactByYear(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              workspace,
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * ADMIN TRACES
   */

  /**
   * adminTracesStats
   * @get admin/tracking/traces
   * @qs { type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesStats({ request, response }: HttpContext) {
    const { isBot, trackingIds } = parseQs(request)
    const now = DateTime.now()
    const stats = await cache.getOrSet({
      key: 'adminTracesStats' + requestToCacheKey(request),
      factory: async () => {
        // count all traces
        const total = await Trace.query()
          .withScopes((scope) => scope.workspace(null))
          .whereIn('trackingId', trackingIds)
          .count('id', 'count')
          .first()

        // get traces from 1 month ago
        const dates = {
          from: now.minus({ months: 1 }).toJSDate(),
          to: now.toJSDate(),
          date: undefined,
        }
        const traces = await getTraces({ dates, isBot, trackingIds })
        const lastMonth = traces.length

        // count traces from today
        const today = traces.filter(
          (trace) => trace.createdAt.toFormat('yyyy-MM-dd') === now.toFormat('yyyy-MM-dd')
        ).length

        // count traces from last 7 days
        const last7Days = traces.filter((trace) => trace.createdAt > now.minus({ days: 7 })).length

        return { today, last7Days, lastMonth, ever: total?.$extras.count ?? 0 }
      },
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByBrowser
   * @get admin/tracking/traces/browser
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByBrowser({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByBrowser' + requestToCacheKey(request),
      factory: async () =>
        compactByBrowser(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByDevice
   * @get admin/tracking/traces/device
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByDevice({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByDevice' + requestToCacheKey(request),
      factory: async () => compactByDevice(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })

    return response.ok({ stats })
  }

  /**
   * tracesByOs
   * @get tracking/traces/os
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByOs({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByOs' + requestToCacheKey(request),
      factory: async () => compactByOs(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByHour
   * @get admin/tracking/traces/hour
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByHour({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByHour' + requestToCacheKey(request),
      factory: async () => compactByHour(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByDay
   * @get admin/tracking/traces/day
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByDay({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByDay' + requestToCacheKey(request),
      factory: async () => compactByDay(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByWeek
   * @get admin/tracking/traces/week
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByWeek({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByWeek' + requestToCacheKey(request),
      factory: async () => compactByWeek(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByMonth
   * @get admin/tracking/traces/month
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByMonth({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByMonth' + requestToCacheKey(request),
      factory: async () => compactByMonth(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTracesByYear
   * @get admin/tracking/traces/year
   * @qs { from?: string, to?: string, date?: string, type?: 'views' | 'clicks', isBot?: 'true' | 'false', trackingIds?: string[] }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTracesByYear({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { unique, ...rest } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTracesByYear' + requestToCacheKey(request),
      factory: async () => compactByYear(uniqByUser(await getTraces({ dates, ...rest }), unique)),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * ADMIN TRACKINGS
   */

  /**
   * adminTrackingStats
   * @get admin/tracking/:trackingId
   * @qs { isBot?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingStats({ request, response }: HttpContext) {
    const { isBot } = parseQs(request)
    const now = DateTime.now()
    const total = await Trace.query()
      .withScopes((scope) => scope.workspace(null))
      .where('trackingId', request.param('trackingId'))
      .count('id', 'count')
      .first()
    const stats = await cache.getOrSet({
      key: 'adminTrackingStats' + requestToCacheKey(request),
      factory: async () => {
        const traces = await Trace.query()
          .withScopes((scope) => scope.workspace(null))
          .withScopes((scope) =>
            scope.whereDateOrInterval({
              from: now.minus({ months: 1 }),
              to: now,
            })
          )
          .where('isBot', isBot)
          .andWhere('trackingId', request.param('trackingId'))
        const today = traces.filter(
          (trace) => trace.createdAt.toFormat('yyyy-MM-dd') === now.toFormat('yyyy-MM-dd')
        ).length
        const last7Days = traces.filter((trace) => trace.createdAt > now.minus({ days: 7 })).length
        const lastMonth = traces.length
        return { today, last7Days, lastMonth, ever: total?.$extras.count ?? 0 }
      },
      ...cacheOptions,
    })

    return response.ok({ stats })
  }

  /**
   * adminTrackingByBrowser
   * @get admin/tracking/:trackingId/browser
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByBrowser({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByBrowser' + requestToCacheKey(request),
      factory: async () =>
        compactByBrowser(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByDevice
   * @get admin/tracking/:trackingId/device
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByDevice({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByDevice' + requestToCacheKey(request),
      factory: async () =>
        compactByDevice(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByOs
   * @get admin/tracking/:trackingId/os
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByOs({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByOs' + requestToCacheKey(request),
      factory: async () =>
        compactByOs(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByHour
   * @get admin/tracking/:trackingId/hour
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByHour({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByHour' + requestToCacheKey(request),
      factory: async () =>
        compactByHour(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByDay
   * @get admin/tracking/:trackingId/day
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByDay({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByDay' + requestToCacheKey(request),
      factory: async () =>
        compactByDay(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByWeek
   * @get admin/tracking/:trackingId/week
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByWeek({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByWeek' + requestToCacheKey(request),
      factory: async () =>
        compactByWeek(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByMonth
   * @get admin/tracking/:trackingId/month
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByMonth({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByMonth' + requestToCacheKey(request),
      factory: async () =>
        compactByMonth(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /**
   * adminTrackingByYear
   * @get admin/tracking/:trackingId/year
   * @query trackingId: Uuid;
   * @qs { from?: string, to?: string, date?: string, isBot?: 'true' | 'false', unique?: 'true' | 'false' }
   * @success 200 Record<string, number>
   * @error 401 INVALID_API_TOKEN | INVALID_AUTH_SESSION
   */
  public async adminTrackingByYear({ request, response }: HttpContext) {
    const dates = await request.validateUsing(dateOrIntervalValidator)
    const { isBot, unique } = parseQs(request)
    const stats = await cache.getOrSet({
      key: 'adminTrackingByYear' + requestToCacheKey(request),
      factory: async () =>
        compactByYear(
          uniqByUser(
            await getTraceByTracking(request.param('trackingId'), {
              dates,
              isBot,
            }),
            unique
          )
        ),
      ...cacheOptions,
    })
    return response.ok({ stats })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * PUBLIC TRACKINGS
   */

  /**
   * trace
   * @post tracking/:trackingId
   * @body { sessionId: string, traceId?: string }
   * @success 200 { traceId: string }
   * **       201 { traceId: string }
   * @error 400 VALIDATION_FAILURE
   * **     404 RESOURCE_NOT_FOUND
   */

  public async trace({ auth, request, session, response }: HttpContext) {
    // get or set sessionId
    let sessionId = session.get('trackingId')
    if (!sessionId) {
      // Generate a new trackingId if it doesn't exist
      sessionId = crypto.randomUUID()
      session.put('trackingId', sessionId)
    }

    // validate request
    const { traceId } = await request.validateUsing(traceValidator)
    const trace = await updateTracker(
      request,
      request.param('trackingId'),
      traceId,
      sessionId,
      G.isNullable(auth.user)
    )
    if (G.isNullable(trace)) throw new E_RESOURCE_NOT_FOUND()
    return response.created({ traceId: trace.id, sessionId })
  }
}

/**
 * utils
 */
const parseQs = (request: HttpContext['request']) => {
  const qs = request.qs()
  const trackingIds = qs.trackingIds
    ? (tryOrUndefinedSync(() => JSON.parse(qs.trackingIds) as string[]) ?? [])
    : []
  const type = qs.type ?? undefined
  const model = qs.model ?? undefined
  const isBot = qs.isBot === 'true' || false
  const unique = qs.unique === 'true' || false
  return { trackingIds, type, model, isBot, unique }
}

type GetTracesParams = {
  workspace?: Workspace
  dates: Infer<typeof dateOrIntervalValidator>
  trackingIds?: string[]
  isBot: boolean
}
const getTraces = async ({ workspace, dates, trackingIds, isBot }: GetTracesParams) => {
  if (G.isNullable(trackingIds)) return []
  const traces = await Trace.query()
    .withScopes((scope) => scope.workspace(workspace))
    .withScopes((scope) => scope.whereDateOrInterval(dates))
    .andWhereIn('trackingId', trackingIds)
    .andWhere('isBot', isBot)
  return traces
}
type GetTracesByTrackingParams = {
  workspace?: Workspace
  dates: Infer<typeof dateOrIntervalValidator>
  isBot: boolean
}
const getTraceByTracking = async (
  trackingId: string,
  { workspace, dates, isBot }: GetTracesByTrackingParams
) =>
  await Trace.query()
    .withScopes((scope) => scope.workspace(workspace))
    .withScopes((query) => query.whereDateOrInterval(dates))
    .where('isBot', isBot)
    .andWhere('trackingId', trackingId)
