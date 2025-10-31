import { useTranslation } from "@compo/localize"
import { A, T } from "@compo/utils"
import { Api } from "@services/dashboard"
import React from "react"
import { FormScheduleRule, localizeRule } from "./utils"

/**
 * useDaysOfWeek
 * Memoized to avoid recalculating the days of week on every render
 * Returns an array of {value: 0-6, label: "Monday"...} for all weekdays
 * @returns Array<{value: number, label: string}>
 */
export const useDaysOfWeek = () => {
  const { format } = useTranslation(dictionary)
  const daysOfWeek = React.useMemo(() => {
    const baseDate = new Date(2024, 0, 1)
    const startOfWeek = T.startOfWeek(baseDate, { weekStartsOn: 1 })
    const endOfWeek = T.endOfWeek(baseDate, { weekStartsOn: 1 })
    const interval = T.eachDayOfInterval({ start: startOfWeek, end: endOfWeek })
    return A.map(interval, (date) => ({
      value: T.getDay(date),
      label: format(date, "EEEE"),
    }))
  }, [format])
  return daysOfWeek
}

/**
 * Format the main time display string
 * Memoized to avoid reformatting dates on every render
 * Handles both all-day events and timed events with start/end dates
 */
export const useTimeStr = (rule: Api.ScheduleRule | FormScheduleRule): string => {
  const { _, format } = useTranslation(dictionary)

  return React.useMemo(() => {
    const ruleFormatted = localizeRule(rule)

    if (ruleFormatted.allDay) {
      if (!ruleFormatted.startDate) return _("schedule-no-date")
      const startDate = ruleFormatted.startDate
      const endDate = ruleFormatted.endDate ? ruleFormatted.endDate : startDate

      const startStr = format(startDate, "d MMM yyyy")
      const endStr = format(endDate, "d MMM yyyy")

      if (T.isSameDay(startDate, endDate)) {
        return `${startStr} - ${_("all-day")}`
      }
      return `${startStr} → ${endStr} - ${_("all-day")}`
    } else {
      if (!ruleFormatted.startDateTime) return _("schedule-no-date")
      const startDateTime = ruleFormatted.startDateTime
      const endDateTime = ruleFormatted.endDateTime ? ruleFormatted.endDateTime : startDateTime
      const startStr = format(startDateTime, "d MMM yyyy 'à' HH:mm")
      const endStr = format(endDateTime, "d MMM yyyy 'à' HH:mm")

      return `${startStr} → ${endStr}`
    }
  }, [format, _, rule])
}

/**
 * Format the recurrence description string
 * Memoized to avoid recalculating the complex recurrence text on every render
 * Builds a human-readable string describing frequency, weekdays, and end date
 * Example outputs: "hebdomadaire • lundi, mercredi • jusqu'au 31 déc 2024"
 */
export const useRecurrenceStr = (rule: Api.ScheduleRule | FormScheduleRule): string | null => {
  const { _, format } = useTranslation(dictionary)
  const daysOfWeek = useDaysOfWeek()
  const recurrenceStr = React.useMemo(() => {
    const ruleFormatted = localizeRule(rule)

    if (!ruleFormatted.isRecurring) return null

    const parts: string[] = []

    // Frequency with interval (e.g., "Every 2 weeks" or "weekly")
    if (ruleFormatted.interval > 1) {
      let unit = ""
      if (ruleFormatted.freq === "DAILY") unit = _("recurrence-days")
      if (ruleFormatted.freq === "WEEKLY") unit = _("recurrence-weeks")
      if (ruleFormatted.freq === "MONTHLY") unit = _("recurrence-months")
      if (ruleFormatted.freq === "YEARLY") unit = _("recurrence-years")
      parts.push(`${_("recurrence-every")} ${ruleFormatted.interval} ${unit}`)
    } else {
      let freqLabel = ""
      if (ruleFormatted.freq === "DAILY") freqLabel = _("recurrence-daily")
      if (ruleFormatted.freq === "WEEKLY") freqLabel = _("recurrence-weekly")
      if (ruleFormatted.freq === "MONTHLY") freqLabel = _("recurrence-monthly")
      if (ruleFormatted.freq === "YEARLY") freqLabel = _("recurrence-yearly")
      parts.push(freqLabel)
    }

    // Weekdays (for weekly recurrence, show selected days like "Monday, Wednesday")
    if (ruleFormatted.freq === "WEEKLY" && ruleFormatted.byWeekday.length > 0) {
      const days = ruleFormatted.byWeekday
        .sort()
        .map((d) => daysOfWeek[d]?.label)
        .filter(Boolean)
        .join(", ")
      parts.push(days)
    }

    // Until date (when the recurrence ends)
    if (ruleFormatted.until) {
      const untilDate = ruleFormatted.until
      parts.push(`${_("recurrence-until")} ${format(untilDate, "d MMM yyyy")}`)
    }

    return parts.join(" • ")
  }, [format, _, rule, daysOfWeek])

  return recurrenceStr
}

/**
 * Calculate next 8 occurrences of this schedule rule
 * Memoized to avoid expensive recalculation on every render
 * This is the most complex calculation as it generates future dates based on:
 * - Recurrence rules (daily, weekly, monthly, yearly)
 * - Weekday constraints
 * - Excluded dates
 * - Start/end dates
 * Only recalculates when the rule object changes
 */
export const useNextOccurrences = <T extends Api.ScheduleRule | FormScheduleRule>(
  rule: T,
  count?: number
): Array<{ start: Date; end: Date | null }> => {
  return React.useMemo(() => {
    const ruleFormatted = localizeRule(rule)
    return getNextOccurrences(ruleFormatted, count)
  }, [rule, count])
}

/**
 * Calculate the next N occurrences for a schedule rule
 *
 * This function generates future dates/times based on the recurrence configuration.
 * It handles both simple (non-recurring) and complex (recurring with various patterns) schedules.
 *
 * @param rule - The schedule rule configuration (API or Form format)
 * @param isDates - Whether the rule uses Date objects (true) or ISO strings (false)
 * @param count - Number of future occurrences to generate (default: 5)
 * @returns Array of {start, end} date pairs for each occurrence
 *
 * Algorithm:
 * 1. For non-recurring: return single occurrence if not excluded
 * 2. For recurring: iterate from start date, applying frequency rules
 * 3. Skip occurrences that:
 *    - Are in the past
 *    - Don't match weekday constraints (for weekly)
 *    - Are explicitly excluded
 * 4. Stop when we have enough occurrences or reach the until date
 */
const getNextOccurrences = (rule: FormScheduleRule, count: number = 5): Array<{ start: Date; end: Date | null }> => {
  const occurrences: Array<{ start: Date; end: Date | null }> = []

  // Extract start/end dates
  const { startDate, endDate, startDateTime, endDateTime, excludedDates } = rule

  const baseStart = rule.allDay ? startDate : startDateTime
  const baseEnd = rule.allDay ? endDate : endDateTime
  if (!baseStart) return occurrences

  // Calculate event duration to apply to each occurrence
  const duration = baseEnd && baseStart ? baseEnd.getTime() - baseStart.getTime() : 0

  // Simple case: non-recurring event
  if (!rule.isRecurring) {
    const isExcluded = excludedDates.some((excludedDate) => T.isSameDay(excludedDate, baseStart))
    if (!isExcluded) {
      occurrences.push({ start: baseStart, end: baseEnd })
    }
    return occurrences
  }

  // Complex case: recurring event - iterate through dates
  let current = new Date(baseStart)
  const now = new Date()
  const until = rule.until ? rule.until : T.addYears(now, 2)

  // Start from today if the base start is in the past
  // For all-day events, compare dates only (ignore time)
  if (rule.allDay) {
    const today = T.startOfDay(now)
    if (T.isBefore(T.startOfDay(current), today)) {
      current = new Date(today)
    }
  } else {
    if (T.isBefore(current, now)) {
      current = new Date(now)
    }
  }

  let iterations = 0
  const maxIterations = 1000 // Safety limit to prevent infinite loops

  // Main loop: generate occurrences until we have enough or reach the end date
  while (occurrences.length < count && T.isBefore(current, until) && iterations < maxIterations) {
    iterations++
    let isValid = true

    // Apply weekday filter for weekly recurrence
    // Example: if byWeekday = [1, 3] (Monday, Wednesday), skip other days
    if (rule.freq === "WEEKLY" && rule.byWeekday.length > 0) {
      const currentDay = T.getDay(current)
      isValid = rule.byWeekday.includes(currentDay)
    }

    // Check if this date is in the excluded dates list
    const isExcluded = excludedDates.some((excludedDate) => T.isSameDay(excludedDate, current))

    // Add occurrence if it passes all filters
    if (isValid && !T.isBefore(current, baseStart) && !isExcluded) {
      const end = duration > 0 ? new Date(current.getTime() + duration) : null
      occurrences.push({ start: new Date(current), end })
    }

    // Move to next candidate date based on frequency
    switch (rule.freq) {
      case "DAILY":
        // Add N days (e.g., every day, every 2 days, etc.)
        current = T.addDays(current, rule.interval)
        break
      case "WEEKLY":
        if (rule.byWeekday.length > 0) {
          // Find next valid weekday in the list
          // Example: if we're on Monday and byWeekday = [1, 3], jump to Wednesday
          let daysToAdd = 1
          for (let i = 1; i <= 7; i++) {
            const nextDate = T.addDays(current, i)
            const nextDay = T.getDay(nextDate)
            if (rule.byWeekday.includes(nextDay)) {
              daysToAdd = i
              break
            }
          }
          current = T.addDays(current, daysToAdd)
        } else {
          // No specific weekdays, just add N weeks
          current = T.addWeeks(current, rule.interval)
        }
        break
      case "MONTHLY":
        // Add N months (keeps same day of month if possible)
        current = T.addMonths(current, rule.interval)
        break
      case "YEARLY":
        // Add N years (keeps same date if possible)
        current = T.addYears(current, rule.interval)
        break
    }
  }

  return occurrences
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    "schedule-no-date": "Aucune date sélectionnée",
    "all-day": "Journée complète",
    "recurrence-daily": "quotidienne",
    "recurrence-weekly": "hebdomadaire",
    "recurrence-monthly": "mensuelle",
    "recurrence-yearly": "annuelle",
    "recurrence-every": "Tous les",
    "recurrence-days": "jours",
    "recurrence-weeks": "semaines",
    "recurrence-months": "mois",
    "recurrence-years": "ans",
    "recurrence-until": "jusqu'au",
    "next-occurrences": "Prochaines dates",
  },
  en: {
    "schedule-no-date": "No date selected",
    "all-day": "All day",
    "recurrence-daily": "daily",
    "recurrence-weekly": "weekly",
    "recurrence-monthly": "monthly",
    "recurrence-yearly": "yearly",
    "recurrence-every": "Every",
    "recurrence-days": "days",
    "recurrence-weeks": "weeks",
    "recurrence-months": "months",
    "recurrence-years": "years",
    "recurrence-until": "until",
    "next-occurrences": "Next dates",
  },
  de: {
    "schedule-no-date": "Kein Datum ausgewählt",
    "all-day": "Ganztägig",
    "recurrence-daily": "täglich",
    "recurrence-weekly": "wöchentlich",
    "recurrence-monthly": "monatlich",
    "recurrence-yearly": "jährlich",
    "recurrence-every": "Alle",
    "recurrence-days": "Tage",
    "recurrence-weeks": "Wochen",
    "recurrence-months": "Monate",
    "recurrence-years": "Jahre",
    "recurrence-until": "bis",
    "next-occurrences": "Nächste Termine",
  },
}
