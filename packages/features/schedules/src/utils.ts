import { A, G, match, T, v4 } from "@compo/utils"
import { Api } from "@services/dashboard"

/**
 * guard function to make sure the frequency is a valid RecurringFrequency
 */
export const makeRecurringFrequency = (freq: string = ""): Api.RecurringFrequency =>
  match(freq)
    .with("WEEKLY", () => "WEEKLY" as Api.RecurringFrequency)
    .with("MONTHLY", () => "MONTHLY" as Api.RecurringFrequency)
    .with("YEARLY", () => "YEARLY" as Api.RecurringFrequency)
    .otherwise(() => "DAILY" as Api.RecurringFrequency)

/**
 * Make schedule rule for form
 */
export const makeScheduleRule = (values: Partial<FormScheduleRule> = {}): FormScheduleRule => ({
  id: values.id || v4(),
  allDay: values.allDay || false,
  startDate: values.startDate || null,
  endDate: values.endDate || null,
  startDateTime: values.startDateTime || null,
  endDateTime: values.endDateTime || null,
  isRecurring: values.isRecurring || false,
  freq: makeRecurringFrequency(values.freq),
  interval: values.interval || 1,
  byWeekday: values.byWeekday || [],
  until: values.until || null,
  excludedDates: values.excludedDates || [],
})

/**
 * Convert form schedule rule to API format
 */
export const formScheduleRuleToApi = (rule: FormScheduleRule): Omit<Api.ScheduleRule, "id"> => {
  const base: any = {}

  // Schedule time
  if (rule.allDay) {
    base.allDay = true
    base.startDate = rule.startDate?.toISOString().split("T")[0] || null
    base.endDate = rule.endDate?.toISOString().split("T")[0] || null
  } else {
    base.allDay = false
    base.startDateTime = rule.startDateTime?.toISOString() || null
    base.endDateTime = rule.endDateTime?.toISOString() || null
  }

  // Recurrence
  if (rule.isRecurring) {
    base.isRecurring = true
    base.freq = rule.freq
    base.interval = rule.interval
    base.byWeekday = rule.byWeekday
    base.until = rule.until?.toISOString().split("T")[0] || null
    base.excludedDates = rule.excludedDates.map((d) => d.toISOString().split("T")[0])
  } else {
    base.isRecurring = false
  }

  return base
}

/**
 * Convert API schedule rule to form format
 */
export const apiScheduleRuleToForm = (rule: Api.ScheduleRule): FormScheduleRule => {
  const base: any = {
    id: rule.id,
    allDay: rule.allDay,
    isRecurring: rule.isRecurring,
  }

  // Schedule time
  if (rule.allDay) {
    base.startDate = rule.startDate ? new Date(rule.startDate) : null
    base.endDate = rule.endDate ? new Date(rule.endDate) : null
    base.startDateTime = null
    base.endDateTime = null
  } else {
    base.startDate = null
    base.endDate = null
    base.startDateTime = rule.startDateTime ? new Date(rule.startDateTime) : null
    base.endDateTime = rule.endDateTime ? new Date(rule.endDateTime) : null
  }

  // Recurrence
  if (rule.isRecurring) {
    base.freq = rule.freq
    base.interval = rule.interval
    base.byWeekday = rule.byWeekday
    base.until = rule.until ? new Date(rule.until) : null
    base.excludedDates = rule.excludedDates?.map((d) => new Date(d)) || []
  } else {
    base.freq = "DAILY"
    base.interval = 1
    base.byWeekday = []
    base.until = null
    base.excludedDates = []
  }

  return base
}

/**
 * Form schedule rule type
 */
export type FormScheduleRule = {
  id: string
  allDay: boolean
  // All day schedule
  startDate: Date | null
  endDate: Date | null
  // Timed schedule
  startDateTime: Date | null
  endDateTime: Date | null
  // Recurrence
  isRecurring: boolean
  freq: Api.RecurringFrequency
  interval: number
  byWeekday: number[]
  until: Date | null
  excludedDates: Date[]
}

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
 * localizeRule
 * @param rule Api.ScheduleRule | FormScheduleRule
 * @returns FormScheduleRule
 */
export const localizeRule = (rule: Api.ScheduleRule | FormScheduleRule): FormScheduleRule => {
  return {
    ...rule,
    startDate: parseDate(rule.startDate),
    endDate: parseDate(rule.endDate),
    startDateTime: parseDate(rule.startDateTime),
    endDateTime: parseDate(rule.endDateTime),
    until: parseDate(rule.until),
    excludedDates: A.map(rule.excludedDates as string[], parseDate),
  }
}
