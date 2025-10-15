import { pageStates } from '#models/page'
import vine from '@vinejs/vine'

export const createPageValidator = vine.compile(
  vine.object({
    state: vine.enum(Object.values(pageStates)).optional(),
    lock: vine.boolean().optional(),
    slug: vine.string().optional(),
  })
)
export const updatePageValidator = vine.compile(
  vine.object({
    state: vine.enum(Object.values(pageStates)).optional(),
    lock: vine.boolean().optional(),
    slug: vine.string().optional(),
  })
)
