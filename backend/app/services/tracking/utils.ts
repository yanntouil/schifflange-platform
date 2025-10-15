import Trace from '#models/trace'
import { A, D, G } from '@mobily/ts-belt'

/**
 * compactByHour
 * Compact traces by hour
 */
export const compactByHour = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const hour = trace.createdAt.toFormat('yyyy-MM-dd|HH')
    return D.set(stats, hour, (stats[hour] ?? 0) + 1)
  })
  return stats
}

/**
 * compactByDay
 * Compact traces by day
 */
export const compactByDay = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const day = trace.createdAt.toFormat('yyyy-MM-dd')
    return D.set(stats, day, (stats[day] ?? 0) + 1)
  })
  return stats
}

/**
 * compactByWeek
 * Compact traces by week
 */
export const compactByWeek = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const week = trace.createdAt.toFormat('yyyy-WW')
    return D.set(stats, week, (stats[week] ?? 0) + 1)
  })
  return stats
}

/**
 * compactByMonth
 * Compact traces by month
 */
export const compactByMonth = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const month = trace.createdAt.toFormat('yyyy-MM')
    return D.set(stats, month, (stats[month] ?? 0) + 1)
  })
  return stats
}

/**
 * compactByYear
 * Compact traces by year
 */
export const compactByYear = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const year = trace.createdAt.toFormat('yyyy')
    return D.set(stats, year, (stats[year] ?? 0) + 1)
  })
  return stats
}

/**
 * compactByBrowser
 * Compact traces by browser
 */
export const compactByBrowser = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const { name, type } = trace.userAgent.client
    if (!(type === 'browser' && G.isNotNullable(name))) return stats
    return D.set(stats, name, (stats[name] ?? 0) + 1)
  })
  return splitFirstsToOthers(stats)
}

/**
 * compactByOs
 * Compact traces by os
 */
export const compactByOs = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const { name } = trace.userAgent.os
    if (G.isNullable(name)) return stats
    return D.set(stats, name, (stats[name] ?? 0) + 1)
  })
  return splitFirstsToOthers(stats)
}

/**
 * compactByDevice
 * Compact traces by device
 */
export const compactByDevice = (traces: Trace[]) => {
  const stats = A.reduce(traces, {} as Record<string, number>, (stats, trace) => {
    const { type } = trace.userAgent.device
    if (G.isNullable(type)) return stats
    return D.set(stats, type, (stats[type] ?? 0) + 1)
  })
  return splitFirstsToOthers(stats)
}

/**
 * splitFirstsToOthers
 * Split firsts to others
 */
export const splitFirstsToOthers = (all: Record<string, number>) => {
  const sortedByVisit = A.sort(D.toPairs(all), ([, a], [, b]) => b - a)
  const [firsts, rest] = A.splitAt(sortedByVisit, 4) ?? [A.take(sortedByVisit, 4), []]
  const firstsBrowser = D.fromPairs(firsts)
  if (A.isEmpty(rest)) return firstsBrowser
  const others = A.reduce(rest, 0, (total, [, count]) => total + count)
  return { ...firstsBrowser, others }
}

/**
 * uniqByUser
 * Unique traces by user
 */
export const uniqByUser = (traces: Trace[], unique: boolean = false) =>
  unique ? A.uniqBy(traces, ({ trackingId, sessionId }) => `${trackingId}|${sessionId}`) : traces
