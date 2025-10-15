// app/validators/admin/security-logs.ts
import { securityEvents } from '#models/security-log'
import vine from '@vinejs/vine'
const formats = { utc: true }

/**
 * Validator for filtering security logs
 */
export const filterSecurityLogsValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid().optional(),
    event: vine.enum(securityEvents).optional(),
    ipAddress: vine.string().ipAddress().optional(),
    dateFrom: vine.date({ formats }).optional(),
    dateTo: vine.date({ formats }).optional(),
  })
)
