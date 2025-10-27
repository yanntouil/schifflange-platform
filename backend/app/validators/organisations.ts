import { organisationTypes } from '#models/organisation'
import { extraFieldValidator } from '#validators/extra-field'
import vine from '@vinejs/vine'

const organisationAddressValidator = vine.object({
  type: vine.enum(['physical', 'postal']),
  street: vine.string().trim(),
  postalCode: vine.string().trim(),
  city: vine.string().trim(),
  country: vine.string().trim(),
  label: vine.string().trim(),
})

export const createOrganisationValidator = vine.compile(
  vine.object({
    type: vine.enum(organisationTypes).optional(),
    parentOrganisationId: vine.string().uuid().optional().nullable(),
    logoImage: vine.file().optional().nullable(),
    cardImage: vine.file().optional().nullable(),
    phones: vine.array(extraFieldValidator).optional(),
    emails: vine.array(extraFieldValidator).optional(),
    extras: vine.array(extraFieldValidator).optional(),
    addresses: vine.array(organisationAddressValidator).optional(),
    categoryIds: vine.array(vine.string().uuid()).optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().optional(),
          description: vine.string().optional(),
          shortDescription: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateOrganisationValidator = vine.compile(
  vine.object({
    type: vine.enum(organisationTypes).optional(),
    parentOrganisationId: vine.string().uuid().optional().nullable(),
    logoImage: vine.file().optional().nullable(),
    cardImage: vine.file().optional().nullable(),
    phones: vine.array(extraFieldValidator).optional(),
    emails: vine.array(extraFieldValidator).optional(),
    extras: vine.array(extraFieldValidator).optional(),
    addresses: vine.array(organisationAddressValidator).optional(),
    categoryIds: vine.array(vine.string().uuid()).optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().optional(),
          description: vine.string().optional(),
          shortDescription: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateOrganisationTranslationsValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    shortDescription: vine.string().optional(),
  })
)

export const sortOrganisationsByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt', 'pinOrder']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterOrganisationsByValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()).optional(),
    types: vine.array(vine.enum(organisationTypes)).optional(),
    pinned: vine.boolean().optional(),
  })
)
