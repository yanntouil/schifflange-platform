import { templateTypes } from '#models/template'
import vine from '@vinejs/vine'

export const createTemplateValidator = vine.compile(
  vine.object({
    type: vine.enum(templateTypes),
    translations: vine.record(
      vine.object({
        title: vine.string().trim().maxLength(255),
        description: vine.string().trim().maxLength(1024),
        tags: vine.array(vine.string().trim().maxLength(255)),
      })
    ),
  })
)

export const updateTemplateValidator = vine.compile(
  vine.object({
    type: vine.enum(templateTypes).optional(),
    translations: vine
      .record(
        vine.object({
          title: vine.string().trim().maxLength(255).optional(),
          description: vine.string().trim().maxLength(1024).optional(),
          tags: vine.array(vine.string().trim().maxLength(255)).optional(),
        })
      )
      .optional(),
  })
)
export const sortTemplatesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterTemplatesByValidator = vine.compile(
  vine.object({
    types: vine.array(vine.enum(templateTypes)).optional(),
  })
)
