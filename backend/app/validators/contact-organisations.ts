import { extraFieldValidator } from '#validators/extra-field'
import vine from '@vinejs/vine'

/**
 * Create contact organisation validator
 */
export const createContactOrganisationValidator = vine.compile(
  vine.object({
    organisationId: vine.string().uuid(),
    phones: vine.array(extraFieldValidator).optional(),
    emails: vine.array(extraFieldValidator).optional(),
    extras: vine.array(extraFieldValidator).optional(),
    isPrimary: vine.boolean().optional(),
    isResponsible: vine.boolean().optional(),
    order: vine.number().optional(),
    startDate: vine
      .date({ formats: ['YYYY-MM-DD', 'iso'] })
      .optional()
      .nullable(),
    endDate: vine
      .date({ formats: ['YYYY-MM-DD', 'iso'] })
      .optional()
      .nullable(),
    translations: vine
      .record(
        vine.object({
          role: vine.string().optional(),
          roleDescription: vine.string().optional(),
        })
      )
      .optional(),
  })
)

/**
 * Update contact organisation validator
 */
export const updateContactOrganisationValidator = vine.compile(
  vine.object({
    phones: vine.array(extraFieldValidator).optional(),
    emails: vine.array(extraFieldValidator).optional(),
    extras: vine.array(extraFieldValidator).optional(),
    isPrimary: vine.boolean().optional(),
    isResponsible: vine.boolean().optional(),
    order: vine.number().optional(),
    startDate: vine
      .date({ formats: ['YYYY-MM-DD', 'iso'] })
      .optional()
      .nullable(),
    endDate: vine
      .date({ formats: ['YYYY-MM-DD', 'iso'] })
      .optional()
      .nullable(),
    translations: vine
      .record(
        vine.object({
          role: vine.string().optional(),
          roleDescription: vine.string().optional(),
        })
      )
      .optional(),
  })
)

/**
 * Update contact organisation translations validator
 */
export const updateContactOrganisationTranslationsValidator = vine.compile(
  vine.object({
    role: vine.string().optional(),
    roleDescription: vine.string().optional(),
  })
)
