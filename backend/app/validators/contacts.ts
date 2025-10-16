import { extraFieldValidator } from '#validators/extra-field'
import vine from '@vinejs/vine'

export const createContactValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    politicalParty: vine.string().optional(),
    portraitImage: vine.file().optional().nullable(),
    squareImage: vine.file().optional().nullable(),
    phones: vine.array(extraFieldValidator).optional(),
    emails: vine.array(extraFieldValidator).optional(),
    extras: vine.array(extraFieldValidator).optional(),
    translations: vine
      .record(
        vine.object({
          biography: vine.string().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateContactValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    politicalParty: vine.string().optional(),
    portraitImage: vine.file().optional().nullable(),
    squareImage: vine.file().optional().nullable(),
    phones: vine.array(extraFieldValidator).optional(),
    emails: vine.array(extraFieldValidator).optional(),
    extras: vine.array(extraFieldValidator).optional(),
    translations: vine
      .record(
        vine.object({
          biography: vine.string().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateContactTranslationsValidator = vine.compile(
  vine.object({
    biography: vine.string().optional(),
    description: vine.string().optional(),
  })
)

export const sortContactsByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterContactsByValidator = vine.compile(
  vine.object({
    organisations: vine.array(vine.string().uuid()).optional(),
  })
)
