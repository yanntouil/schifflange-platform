import { organisationTypes } from '#models/organisation'
import vine from '@vinejs/vine'

export const createOrganisationCategoryValidator = vine.compile(
  vine.object({
    type: vine.enum(organisationTypes).optional(),
    order: vine.number().optional(),
    image: vine.file().optional().nullable(),
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateOrganisationCategoryValidator = vine.compile(
  vine.object({
    type: vine.enum(organisationTypes).optional(),
    order: vine.number().optional(),
    image: vine.file().optional().nullable(),
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateOrganisationCategoryTranslationsValidator = vine.compile(
  vine.object({
    title: vine.string().optional(),
    description: vine.string().optional(),
  })
)

export const sortOrganisationCategoriesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt', 'order']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterOrganisationCategoriesByValidator = vine.compile(
  vine.object({
    //
  })
)
