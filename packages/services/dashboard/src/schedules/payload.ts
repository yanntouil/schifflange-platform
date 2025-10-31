export type Update = {
  rules?: {
    startDate?: string | null // isoDate default null
    endDate?: string | null // isoDate default null
    startDateTime?: string | null // isoDateTime default null
    endDateTime?: string | null // isoDateTime default null
    freq?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" // default "DAILY"
    interval?: number // default 1
    byWeekday?: number[] // default []
    until?: string | null // isoDate default null
    excludedDates?: string[] // isoDates[] default []
    allDay?: boolean // default false
    isRecurring?: boolean // default false
  }[]
}
