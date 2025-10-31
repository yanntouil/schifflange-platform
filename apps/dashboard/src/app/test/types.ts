/**
 * Event entity
 */
export type Event = {
  id: string
  name: string
  description: string
  location: string
  schedules: Schedule[]
}

/**
 * Schedule entity
 */
export type Schedule = {
  id: string
  eventId: string
} & ScheduleTime &
  RecurrenceRule

/**
 * Schedule time
 */
export type ScheduleTime = AllDaySchedule | TimedSchedule

export type AllDaySchedule = {
  allDay: true
  startDate: Date
  endDate: Date
}

export type TimedSchedule = {
  allDay: false
  startDateTime: Date
  endDateTime: Date
}

/**
 * Recurrence rule
 */
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
  until: Date | null // end date (null = indefinite)
}
