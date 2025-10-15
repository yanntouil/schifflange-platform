import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const dateOrIntervalValidator = vine.compile(
  vine.object({
    from: vine.date().optional(),
    to: vine.date().optional(),
    date: vine.date().optional(),
  })
)
export type DateOrIntervalJs = Infer<typeof dateOrIntervalValidator>
