import { G } from "@mobily/ts-belt"
import * as T from "date-fns"
import * as Tz from "date-fns-tz"
export { de, de as deDE, enGB, enUS, es, fr, fr as frFR, it, ja, ko, lb, pt, ru, zhCN, zhTW } from "date-fns/locale"
export { T, Tz }

/**
 * parseDate
 * @param date string | Date | null
 * @returns Date | null
 */
export const parseDate = <T extends string | Date | null>(
  date: T
): T extends string ? Date : T extends Date ? Date : null => {
  if (G.isNullable(date)) return null as any
  if (G.isString(date)) return T.parseISO(date) as any
  return date as any
}

/**
 * dateToISO
 * @param date Date | null
 * @returns string | null
 */
export const dateToISO = (date: Date | null): string | null => {
  if (G.isNullable(date)) return null
  return T.formatISO(date)
}
