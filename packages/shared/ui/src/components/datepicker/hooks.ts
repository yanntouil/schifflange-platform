import { useToday } from "@compo/hooks"
import { D, T, memoize } from "@compo/utils"
import React from "react"

export const useCalendarDays = (
  initialSelectedDate: Date,
  onChange?: (date: Date) => void,
  interval?: { start: Date; end: Date }
) => {
  const mountNow = React.useRef<Date>(new Date()) // store default now as component mount time

  const today = useToday()

  const [now, refreshNow] = React.useReducer(() => new Date(), mountNow.current)

  const [selectedDate, setSelectedDate] = React.useState<Date>(initialSelectedDate) // user selected date
  const [openedDate, setOpenedDate] = React.useState<Date>(selectedDate) // user selected date

  // get surrounding calendar month days for openedDate
  const { openDays, openInterval } = React.useMemo(
    () =>
      T.isValid(openedDate)
        ? dateToCalendarMonth(openedDate)
        : {
            openDays: [],
            openInterval: { start: openedDate, end: openedDate },
          },
    [openedDate]
  )

  const openedWeekDays = React.useMemo(() => (T.isValid(openedDate) ? dateToWeek(openedDate) : []), [openedDate])

  // update open date with selected date
  const setDates = React.useCallback(
    (nextDate: Date) => {
      onChange && onChange(nextDate)
      setSelectedDate(nextDate)
      setOpenedDate(nextDate)
    },
    [onChange]
  )

  // memo open helpers callbacks
  const openHelpers = React.useMemo(() => {
    const open = (opts: T.Duration) => setOpenedDate(T.add(openedDate, opts))
    return {
      openMonth: (month: number) => setOpenedDate(T.setMonth(openedDate, month)),
      openYear: (year: number) => setOpenedDate(T.setYear(openedDate, year)),
      openPrevMonth: () => open({ months: -1 }),
      openNextMonth: () => open({ months: 1 }),
      openPrevWeek: () => open({ weeks: -1 }),
      openNextWeek: () => open({ weeks: 1 }),
      open,
    }
  }, [openedDate])

  // memo select helpers callbacks
  const selectHelpers = React.useMemo(
    () => ({
      select: (duration = {}) => setDates(T.add(selectedDate, duration)),
    }),
    [selectedDate, setDates]
  )

  return {
    // state
    now,
    openDays,
    interval,
    openedWeekDays,
    selectedDate,
    selectedDateKey: formatDateKey(selectedDate),
    openedDate,
    // actions
    refreshNow,
    setSelectedDate: setDates,
    setOpenedDate,
    selectNow: () => setDates(now),
    today,
    openInterval,
    ...openHelpers,
    ...selectHelpers,
  }
}

/**
 * dateToCalendarMonth:
 * get surrounding calendar month days for any date
 */
const calendarMonthDays = 6 * 7
const dateToCalendarMonth = (date: Date, weekStartsOn: 0 | 1 = 1) => {
  const monthStart = T.startOfMonth(date)
  const weekStart = T.startOfWeek(monthStart, { weekStartsOn })

  const calendarMonthEnd = T.add(weekStart, { days: calendarMonthDays - 1 })
  const openInterval = {
    start: T.startOfDay(weekStart),
    end: T.endOfDay(calendarMonthEnd),
  }
  return { openDays: T.eachDayOfInterval(openInterval), openInterval }
}

/**
 * dateToWeek:
 * get surrounding week days for any date
 */
export const dateToWeek = (date: Date, weekStartsOn: 0 | 1 = 1) =>
  T.eachDayOfInterval({
    start: T.startOfDay(T.startOfWeek(date, { weekStartsOn })),
    end: T.endOfDay(T.endOfWeek(date, { weekStartsOn })),
  })

/**
 * formatDateKey
 * format a date to a key
 */
const dateKeyFormat = "yyyy-MM-dd"
export const formatDateKey = (date: Date | number) => T.format(date, dateKeyFormat)

/**
 * dateIsWeekend
 * check if a date is a weekend
 */
export const dateIsWeekend = (date: Date) => T.isWeekend(date)

/**
 * useIsWeekend
 * @param date - The date to check if it is a weekend
 * @returns True if the date is a weekend, otherwise false
 */
export const useIsWeekend = (date: Date) => {
  return T.isWeekend(date)
}

/**
 * useIsHoliday
 * @param date - The date to check if it is a holiday
 * @returns The holiday type if the date is a holiday, otherwise false
 */
export const useHoliday = (date: Date, includeGoodFriday = false) => {
  const holidays = generateLuxembourgHolidays(date.getFullYear(), includeGoodFriday)
  return D.get(holidays, formatDateKey(date)) ?? false
}

/**
 * helpers to generate easter date for a given year
 */
export const getEasterDate = (year: number): Date => {
  const f = Math.floor
  const a = year % 19
  const b = f(year / 100)
  const c = year % 100
  const d = f(b / 4)
  const e = b % 4
  const g = f((8 * b + 13) / 25)
  const h = (19 * a + b - d - g + 15) % 30
  const i = f(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = f((a + 11 * h + 22 * l) / 451)
  const month = f((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/**
 * helpers to generate holidays for a given year
 */
export const generateLuxembourgHolidays = memoize((year: number, includeGoodFriday = false) => {
  const easter = getEasterDate(year)
  const holidays = {
    [T.formatISO(new Date(year, 0, 1), { representation: "date" })]: "new-year" as const,
    [T.formatISO(T.addDays(easter, 1), { representation: "date" })]: "easter-monday" as const,
    [T.formatISO(new Date(year, 4, 1), { representation: "date" })]: "labor-day" as const,
    [T.formatISO(new Date(year, 4, 9), { representation: "date" })]: "europe-day" as const,
    [T.formatISO(T.addDays(easter, 39), { representation: "date" })]: "ascension" as const,
    [T.formatISO(T.addDays(easter, 50), { representation: "date" })]: "pentecost-monday" as const,
    [T.formatISO(new Date(year, 5, 23), { representation: "date" })]: "national-day" as const,
    [T.formatISO(new Date(year, 7, 15), { representation: "date" })]: "assumption" as const,
    [T.formatISO(new Date(year, 10, 1), { representation: "date" })]: "all-souls-day" as const,
    [T.formatISO(new Date(year, 11, 25), { representation: "date" })]: "christmas" as const,
    [T.formatISO(new Date(year, 11, 26), { representation: "date" })]: "st-stephens-day" as const,
  }
  if (includeGoodFriday) {
    return {
      ...holidays,
      [T.formatISO(T.addDays(easter, -2), { representation: "date" })]: "good-friday" as const,
    }
  }
  return holidays
})
