import { recurringFrequencies } from '#models/schedule-rule'
import vine from '@vinejs/vine'
const formats = { utc: true }
/**
 * Update Schedule (with all rules)
 * Replaces all rules at once
 */
export const updateScheduleValidator = vine.compile(
  vine.object({
    rules: vine
      .array(
        vine.object({
          allDay: vine.boolean().optional(),
          startDate: vine.date().optional(),
          endDate: vine.date().optional().nullable(),
          startDateTime: vine.date({ formats }).optional().nullable(),
          endDateTime: vine.date({ formats }).optional().nullable(),
          isRecurring: vine.boolean().optional(),
          freq: vine.enum(recurringFrequencies).optional(),
          interval: vine.number().withoutDecimals().min(1).optional(),
          byWeekday: vine.array(vine.number().withoutDecimals().min(0).max(6)).optional(),
          until: vine.date().optional().nullable(),
          excludedDates: vine.array(vine.date()).optional(),
        })
      )
      .optional(),
  })
)
