import env from '#start/env'
import vine from '@vinejs/vine'
const formats = { utc: true }

/**
 * Validator for login requests
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
    remember: vine.boolean().optional(),
  })
)

/**
 * Validator for registration requests
 */
export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

/**
 * Validator for token requests
 */
export const tokenValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
  })
)

/**
 * Validator for update requests
 */
export const updateValidator = vine.compile(
  vine.object({
    email: vine.string().email().optional(),
    password: vine.string().optional(),
  })
)

/**
 * Validator for update requests
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    firstname: vine.string().trim().optional(),
    lastname: vine.string().trim().optional(),
    dob: vine.date({ formats }).nullable().optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .nullable()
      .optional(),
    position: vine.string().trim().optional(),
    company: vine.string().trim().optional(),
    emails: vine
      .array(
        vine.object({
          name: vine.string().trim(),
          value: vine.string().trim(),
        })
      )
      .optional(),
    phones: vine
      .array(
        vine.object({
          name: vine.string().trim(),
          value: vine.string().trim(),
        })
      )
      .optional(),
    address: vine
      .object({
        street: vine.string().trim(),
        city: vine.string().trim(),
        state: vine.string().trim(),
        zip: vine.string().trim(),
        country: vine.string().trim(),
      })
      .optional(),
    extras: vine
      .array(
        vine.object({
          name: vine.string().trim(),
          value: vine.string().trim(),
        })
      )
      .optional(),
  })
)

/**
 * Validator for forgot password requests
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

/**
 * Validator for password reset requests
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    password: vine.string().minLength(8),
  })
)
