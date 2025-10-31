import { eventStates } from '#models/event'
import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    state: vine.enum(eventStates).optional(),
    categoryIds: vine.array(vine.string().uuid()).optional(),
  })
)
export const updateEventValidator = vine.compile(
  vine.object({
    state: vine.enum(eventStates).optional(),
    categoryIds: vine.array(vine.string().uuid()).optional(),
  })
)
export const sortEventsByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterEventsByValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()).optional(),
    in: vine.array(vine.string().uuid()).optional(),
    isPublished: vine.boolean().optional(),
  })
)

export const createEventCategoryValidator = vine.compile(
  vine.object({
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
          imageId: vine
            .string()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
)
export const updateEventCategoryValidator = vine.compile(
  vine.object({
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
          imageId: vine
            .string()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
)
export const reorderEventCategoriesValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()),
  })
)
export const sortEventCategoriesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterEventCategoriesByValidator = vine.compile(
  vine.object({
    //
  })
)
