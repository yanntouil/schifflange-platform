import { LucidRow } from '@adonisjs/lucid/types/model'
import { A, G, O } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * columnJSON
 * helper to handle JSON columns
 */
export const columnJSON = <T extends Record<string, any> | any[]>(
  onError: T,
  serialize?: (value: T, attribute: string, model: LucidRow) => any
) => ({
  consume: (value: string | T) => {
    if (G.isString(value)) {
      try {
        return JSON.parse(value)
      } catch (e) {
        return onError
      }
    } else return value
  },
  prepare: (value: string | T) => {
    if (G.isArray(value) || G.isObject(value)) {
      try {
        return JSON.stringify(value)
      } catch (e) {
        return JSON.stringify(onError)
      }
    } else return value
  },
  serialize,
})

/**
 * columnJSONDateTimeArray
 * helper to handle JSON columns for DateTime arrays
 */
export const columnJSONDateTimeArray = (onError: DateTime<true>[] = []) => ({
  consume: (value: string): DateTime<true>[] | null => {
    if (G.isString(value)) {
      try {
        const dates = JSON.parse(value)
        if (G.isArray(dates)) {
          return A.filterMap(dates, (date: string) => {
            const dateTime = DateTime.fromISO(date)
            if (G.isNotNullable(dateTime) && dateTime.isValid) return O.Some(dateTime)
            return O.None
          })
        }
      } catch (_) {}
    }
    return onError
  },
  prepare: (value: DateTime<true>[]) => {
    const isoStrings = A.filterMap(value, (date) => {
      if (G.isNotNullable(date)) return O.Some(date.toISO()!)
      return O.None
    })
    return JSON.stringify(isoStrings)
  },
  serialize: (value: DateTime[]) => {
    return value.map((date) => date.toISO()!)
  },
})
