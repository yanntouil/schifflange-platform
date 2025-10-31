import { A, match, v4 } from "@compo/utils"
import { Event, RecurringFrequency, Schedule } from "./types"

/**
 * Get the duration of a schedule
 * @param schedule - The schedule to get the duration of
 * @returns The duration of the schedule in days or minutes
 */
export function getScheduleDuration(schedule: Schedule): number {
  if (schedule.allDay) {
    const days = Math.ceil((schedule.endDate.getTime() - schedule.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return days
  }
  return Math.ceil((schedule.endDateTime.getTime() - schedule.startDateTime.getTime()) / (1000 * 60))
}

/**
 * guard function to make sure the frequency is a valid RecurringFrequency
 */
export const makeRecurringFrequency = (freq: string = ""): RecurringFrequency =>
  match(freq)
    .with("WEEKLY", () => "WEEKLY" as RecurringFrequency)
    .with("MONTHLY", () => "MONTHLY" as RecurringFrequency)
    .with("YEARLY", () => "YEARLY" as RecurringFrequency)
    .otherwise(() => "DAILY" as RecurringFrequency)

/**
 * Make values
 */
export const makeValues = (values: Partial<FormValues> = {}): FormValues => ({
  name: values.name || "",
  description: values.description || "",
  location: values.location || "",
  schedules: values.schedules ? A.map(values.schedules, makeSchedule) : [makeSchedule()],
})

/**
 * Make schedule
 */
export const makeSchedule = (values: Partial<FormSchedule> = {}): FormSchedule => ({
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
})

type FormSchedule = {
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
  freq: RecurringFrequency
  interval: number
  byWeekday: number[]
  until: Date | null
}

type FormValues = Omit<Event, "id" | "schedules"> & {
  schedules: FormSchedule[]
}
