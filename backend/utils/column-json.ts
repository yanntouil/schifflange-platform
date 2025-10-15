import { LucidRow } from '@adonisjs/lucid/types/model'
import { G } from '@mobily/ts-belt'

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
