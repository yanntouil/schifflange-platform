import Trace from '#models/trace'
import UidService from '#services/uid'
import { A } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * tracesSeeder
 */
export const tracesSeeder = async (
  trackingId: string,
  workspaceId: string | null,
  date: DateTime,
  range: number,
  records: number,
  callback?: (trace: Trace) => void
) => {
  const users = generateUsers(Math.round(records / 4) + 1)
  const traces: Trace[] = []
  for (let i = 0; i < records; i++) {
    const trace = {
      ...randomElement(users),
      sessionDuration: generateDuration(),
      isBot: false,
      userAgent: {
        client: {
          type: 'browser',
          name: randomElement(browsers),
        },
        os: {
          name: randomElement(oss),
        },
        device: {
          type: randomElement(devices),
        },
        bot: {},
        coords: {},
      },
      trackingId,
      workspaceId,
      createdAt: generateDate(date, range),
    }
    const newTrace = await Trace.create(trace)
    callback?.(newTrace)
    traces.push(newTrace)
  }
  return traces
}

/**
 * helpers
 */
// Returns a random element from the given array
export const randomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

// Generates a random integer between the specified min and max values
export const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)

// Creates an array of user objects with random session IDs and authentication status
const generateUsers = (count: number) =>
  A.makeWithIndex(count, () => ({
    sessionId: UidService.generateUid(),
    isAuth: Math.random() > 0.75,
  }))

// Generates a random date within a specified range around a given date
const generateDate = (date: DateTime, range: number) =>
  date.plus({ days: Math.floor(Math.random() * range) - range / 2 }).set(randomTime())

// Generates a random session duration in seconds
const generateDuration = () => Math.floor(Math.random() * 7200)

// Generates a random time of day
const randomTime = () => ({
  hour: randomRange(0, 23),
  minute: randomRange(0, 59),
  second: randomRange(0, 59),
})
/**
 * random data
 */
const browsers = [
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Chrome',
  'Safari',
  'Safari',
  'Safari',
  'Safari',
  'Safari',
  'Safari',
  'Samsung Browser',
  'Samsung Browser',
  'Firefox',
  'Edge',
  'Opera',
]
const oss = [
  'Windows',
  'Windows',
  'Windows',
  'Windows',
  'CentOS',
  'Debian',
  'Ubuntu',
  'Android',
  'Android',
  'Android',
  'Android',
  'Chrome OS',
  'iOS',
  'iOS',
  'iOS',
  'Mac',
  'Mac',
  'Mac',
]
const devices = [
  'desktop',
  'desktop',
  'desktop',
  'desktop',
  'desktop',
  'smartphone',
  'smartphone',
  'smartphone',
  'smartphone',
  'smartphone',
  'tablet',
  'tablet',
  'tablet',
  'television',
  'smart display',
  'console',
]
