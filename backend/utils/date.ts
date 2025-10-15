import { G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * DateOrInterval
 */
export type DateOrIntervalLuxon = {
  from?: DateTime<true>
  to?: DateTime<true>
  date?: DateTime<true>
}
export type DateOrIntervalJs = {
  from?: Date
  to?: Date
  date?: Date
}

/**
 * Convert a Date or DateTime to a DateTime
 */
export const luxonOrJsDate = (date: Date | DateTime | unknown): DateTime<true> | null => {
  if (G.isDate(date)) {
    const luxonDate = DateTime.fromJSDate(date)
    if (luxonDate.isValid) return luxonDate
    return null
  }
  if (DateTime.isDateTime(date)) {
    if (date.isValid) return date
    return null
  }
  return null
}
