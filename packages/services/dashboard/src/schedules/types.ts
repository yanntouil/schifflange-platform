import { schedule } from "."

export type Schedule = {
  id: string
  rules: ScheduleRule[]
}

export type ScheduleRule = {
  id: string
  allDay: false
  startDate: string | null // isoDate
  endDate: string | null // isoDate
  startDateTime: string | null // isoDateTime
  endDateTime: string | null // isoDateTime
  isRecurring: boolean
  freq: RecurringFrequency
  interval: number
  byWeekday: number[] // [0-6] sun-sat (only for WEEKLY)
  until: string | null // isoDate (null = indefinite)
  excludedDates: string[] // isoDates
}

// Schedule time
export type ScheduleTime = AllDaySchedule | TimedSchedule
export type AllDaySchedule = {
  allDay: true
  startDate: string | null // isoDate
  endDate: string | null // isoDate
}

export type TimedSchedule = {
  allDay: false
  startDateTime: string | null // isoDateTime
  endDateTime: string | null // isoDateTime
}

// Recurrence rule
export type RecurrenceRule = NonRecurring | Recurring

export type NonRecurring = {
  isRecurring: false
}
export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
export type Recurring = {
  isRecurring: true
  freq: RecurringFrequency
  interval: number
  byWeekday: number[] // [0-6] sun-sat (only for WEEKLY)
  until: string | null // isoDate (null = indefinite)
  excludedDates: string[] // isoDates
}
export type WithSchedule = {
  schedule: Schedule
}
export type ScheduleService = ReturnType<typeof schedule>
