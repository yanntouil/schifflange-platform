import Trace from '#models/trace'
import Tracking from '#models/tracking'
import UidService from '#services/uid'
import { extractUserAgent } from '#services/utils/user-agent'
import { HttpContext } from '@adonisjs/core/http'
import { G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * updateTracker
 */
export const updateTracker = async (
  request: HttpContext['request'],
  trackingId: string,
  traceId?: string,
  sessionId?: string,
  isAuth: boolean = false
) => {
  const session = sessionId ?? request.ctx?.session?.get('trackingId')
  const tracking = await Tracking.query().where('id', trackingId).first()
  if (G.isNullable(tracking)) return null

  // check if a trace with the same id and trackingId exists
  if (G.isNotNullable(traceId)) {
    const trace = await tracking.related('traces').query().where('id', traceId).first()
    if (G.isNullable(trace)) return null
    return appendTimeToTrace(trace)
  }

  // check if a trace with the same sessionId and was posted in the last 2 minutes
  console.log('tracking', { session, date: DateTime.now().minus({ minutes: 2 }).toSQL() })
  const recentTrace = await tracking
    .related('traces')
    .query()
    .andWhere('sessionId', session)
    .andWhere('createdAt', '>', DateTime.now().minus({ minutes: 2 }).toSQL())
    .first()
  if (G.isNotNullable(recentTrace)) {
    return appendTimeToTrace(recentTrace)
  }
  const [isBot, userAgent] = extractUserAgent(request)
  const coords = {}
  const trace = await tracking.related('traces').create({
    workspaceId: tracking.workspaceId,
    userAgent: { ...userAgent, coords },
    sessionId: sessionId ?? UidService.generateUid(),
    isAuth,
    isBot,
  })
  return trace
}

const appendTimeToTrace = async (trace: Trace) => {
  trace.sessionDuration = Date.now() - trace.createdAt.toJSDate().getTime()
  await trace.save()
  return trace
}
