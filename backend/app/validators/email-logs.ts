import { emailStatuses } from '#models/email-log'
import vine from '@vinejs/vine'

export const filterEmailLogsValidator = vine.compile(
  vine.object({
    status: vine.enum(emailStatuses).nullable().optional(),
    email: vine.string().nullable().optional(),
    template: vine.string().nullable().optional(),
  })
)
