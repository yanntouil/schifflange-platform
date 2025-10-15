// app/validators/admin/users.ts
import { userRoles, userStatuses } from '#models/user'
import env from '#start/env'
import vine from '@vinejs/vine'
const formats = { utc: true }

/**
 * Validator for creating users
 */
export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).optional(),
    role: vine.enum(userRoles).optional(),
    status: vine.enum(userStatuses).optional(),
    languageId: vine.string().optional(),
  })
)

/**
 * Validator for updating users
 */
export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().optional(),
    password: vine.string().minLength(8).optional(),
    role: vine.enum(userRoles).optional(),
    status: vine.enum(userStatuses).optional(),
    languageId: vine.string().optional(),
    noEmit: vine.boolean().optional(),
  })
)

/**
 * Validator for checking if an email exists
 */
export const emailExistsValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

/**
 * Validator for filtering users
 */
export const filterUsersValidator = vine.compile(
  vine.object({
    status: vine.enum(userStatuses).optional(),
    role: vine.array(vine.enum(userRoles)).optional(),
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
 * Validator for sorting users
 */
export const sortUsersByValidator = vine.compile(
  vine.object({
    field: vine
      .enum(['email', 'firstname', 'lastname', 'role', 'status', 'createdAt', 'updatedAt'])
      .optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
