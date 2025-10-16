import vine from '@vinejs/vine'

/**
 * ExtraField validator
 * Used for phones, emails, extras arrays in contacts, organisations, etc.
 */
export const extraFieldValidator = vine.object({
  name: vine.string().trim(),
  value: vine.string().trim(),
  type: vine
    .enum([
      'phone',
      'email',
      'url',
      'text',
      'number',
      'boolean',
      'date',
      'time',
      'datetime',
      'textarea',
    ])
    .optional(),
})
