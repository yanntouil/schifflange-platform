import { A, D, G, S, T, capitalize, match, pipe } from "@compo/utils"
import { DisplayByName, RangeName, StatsInterval } from "./types"

/**
 * toRechartsData
 * Convert a record of stats to an array of objects for Recharts
 */
export const toRechartsData = (stats: Record<string, number>) =>
  D.toPairs(stats).map(([key, value]) => ({ name: capitalize(key), value }))

/**
 * parseIsoWeek
 * Parse a yearWeek string to a Date
 */
export const parseIsoWeek = (yearWeek: string, locale: T.Locale): Date => {
  const [year, week] = A.map(S.split(yearWeek, "-"), Number)
  if (G.isNullable(year) || G.isNullable(week)) throw new Error("Invalid yearWeek")
  return T.startOfWeek(T.setWeek(T.setYear(T.startOfYear(new Date()), year), week), { locale })
}

/**
 * parseIsoMonth
 * Parse a yearMonth string to a Date
 */
export const parseIsoMonth = (yearMonth: string): Date => {
  const [year, month] = A.map(S.split(yearMonth, "-"), Number)
  if (G.isNullable(year) || G.isNullable(month)) throw new Error("Invalid yearMonth")
  return T.startOfMonth(T.setMonth(T.setYear(T.startOfYear(new Date()), year), month))
}

/**
 * parseIsoYear
 * Parse a year string to a Date
 */
export const parseIsoYear = (year: string): Date => {
  return T.startOfYear(new Date(+year, 1, 1))
}

/**
 * prepareIntervalParams
 * Prepare interval params for the API
 */
export const prepareIntervalParams = (
  interval: StatsInterval,
  displayBy: DisplayByName = "months",
  today: Date,
  locale: T.Locale
) => {
  const { from, to = today } = interval
  return match(displayBy)
    .with("hours", () => {
      return { date: T.formatISO(to, { representation: "date" }) }
    })
    .with("days", () => {
      return from
        ? {
            from: T.formatISO(from, { representation: "date" }),
            to: T.formatISO(to, { representation: "date" }),
          }
        : { to: T.formatISO(to, { representation: "date" }) }
    })
    .with("weeks", () => {
      return from
        ? {
            from: T.formatISO(T.startOfWeek(from, { locale, weekStartsOn: locale.options?.weekStartsOn }), {
              representation: "date",
            }),
            to: T.formatISO(T.endOfWeek(to, { locale, weekStartsOn: locale.options?.weekStartsOn }), {
              representation: "date",
            }),
          }
        : {
            to: T.formatISO(T.endOfWeek(to, { locale, weekStartsOn: locale.options?.weekStartsOn }), {
              representation: "date",
            }),
          }
    })
    .with("months", () => {
      return from
        ? {
            from: T.formatISO(T.startOfMonth(from), { representation: "date" }),
            to: T.formatISO(T.endOfMonth(to), { representation: "date" }),
          }
        : { to: T.formatISO(T.endOfMonth(to), { representation: "date" }) }
    })
    .with("years", () => {
      return from
        ? {
            from: T.formatISO(T.startOfYear(from), { representation: "date" }),
            to: T.formatISO(T.endOfYear(to), { representation: "date" }),
          }
        : { to: T.formatISO(T.endOfYear(to), { representation: "date" }) }
    })
    .exhaustive()
}

/**
 * earlyBetweenData
 * Get the earliest date between two records
 */
export const earlyBetweenData = (data1: Record<string, number>, data2: Record<string, number> = {}) => {
  const start1 = pipe(
    D.keys(data1),
    A.map(parseIsoMonth),
    A.sortBy((d) => d),
    A.head
  )
  const start2 = pipe(
    D.keys(data2),
    A.map(parseIsoMonth),
    A.sortBy((d) => d),
    A.head
  )
  if (G.isNullable(start1)) return start2 ?? new Date()
  if (G.isNullable(start2)) return start1
  return start1 < start2 ? start1 : start2
}

/**
 * intervalFromRange
 * Get the interval from a range name
 */
export const intervalFromRange = (range: RangeName, to: Date): StatsInterval => {
  return match(range)
    .with("7days", () => ({ from: T.sub(to, { days: 7 }), to }))
    .with("1month", () => ({ from: T.sub(to, { months: 1 }), to }))
    .with("3months", () => ({ from: T.sub(to, { months: 3 }), to }))
    .with("6months", () => ({ from: T.sub(to, { months: 6 }), to }))
    .with("12months", () => ({ from: T.sub(to, { years: 1 }), to }))
    .with("all", () => ({ from: undefined, to }))
    .exhaustive()
}

/**
 * intervalFromDisplayBy
 * Get the interval from a display by name
 */
export const intervalFromDisplayBy = (displayBy: DisplayByName, today: Date): StatsInterval => {
  return match(displayBy)
    .with("hours", () => ({ from: T.add(today, { hours: -24 }), to: today }))
    .with("days", () => ({ from: T.add(today, { days: -30 }), to: today }))
    .with("weeks", () => ({ from: T.add(today, { weeks: -4 }), to: today }))
    .with("months", () => ({ from: T.add(today, { months: -12 }), to: today }))
    .with("years", () => ({ from: undefined, to: today }))
    .exhaustive()
}
