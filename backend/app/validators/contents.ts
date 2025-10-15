import { contentItemStates } from '#models/content-item'
import vine from '@vinejs/vine'

export const updateContentValidator = vine.compile(
  vine.object({
    //
  })
)
export const createContentItemValidator = vine.compile(
  vine.object({
    state: vine.enum(Object.values(contentItemStates)).optional(),
    order: vine.number().withoutDecimals().min(0).optional(),
    type: vine.string().optional(),
    props: vine.record(vine.any().nullable()).optional(),
    files: vine
      .array(vine.string().uuid().exists({ table: 'media_files', column: 'id' }))
      .optional(),
    translations: vine
      .record(
        vine.object({
          props: vine.record(vine.any().nullable()).optional(),
        })
      )
      .optional(),
  })
)
export const updateContentItemValidator = vine.compile(
  vine.object({
    state: vine.enum(Object.values(contentItemStates)).optional(),
    type: vine.string().optional(),
    props: vine.record(vine.any().nullable()).optional(),
    files: vine
      .array(vine.string().uuid().exists({ table: 'media_files', column: 'id' }))
      .optional(),
    slugs: vine.array(vine.string().uuid().exists({ table: 'slugs', column: 'id' })).optional(),
    translations: vine
      .record(
        vine.object({
          props: vine.record(vine.any().nullable()).optional(),
        })
      )
      .optional(),
  })
)
export const reorderContentItemsValidator = vine.compile(
  vine.object({
    items: vine.array(vine.string().uuid()),
  })
)
