import { workspaceRoles } from '#models/workspace'
import env from '#start/env'
import vine from '@vinejs/vine'

export const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    config: vine.record(vine.record(vine.any().nullable())).optional(),
    themeId: vine.string().uuid().exists({ table: 'workspace_themes', column: 'id' }).optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional(),
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    config: vine.record(vine.record(vine.any().nullable())).optional(),
    themeId: vine
      .string()
      .uuid()
      .exists({ table: 'workspace_themes', column: 'id' })
      .nullable()
      .optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional()
      .nullable(),
    profileLogo: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional()
      .nullable(),
    profile: vine.object({
      logo: vine
        .file({
          size: env.get('FILES_MAX_SIZE'),
        })
        .optional()
        .nullable(),
      translations: vine
        .record(
          vine.object({
            welcomeMessage: vine.string().trim().maxLength(255),
          })
        )
        .optional(),
    }),
  })
)
export const updateMemberValidator = vine.compile(
  vine.object({
    role: vine.enum(workspaceRoles),
  })
)

export const invitationSignUpValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    password: vine.string().trim(),
  })
)

export const invitationTokenValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
  })
)
export const createInvitationValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(255),
    language: vine.string().uuid().exists({ table: 'languages', column: 'id' }).optional(),
    role: vine.enum(workspaceRoles).optional(),
  })
)
export const updateLanguagesValidator = vine.compile(
  vine.object({
    languages: vine.array(vine.string().uuid().exists({ table: 'languages', column: 'id' })),
  })
)
export const updateConfigValidator = vine.compile(
  vine.object({
    config: vine.record(vine.record(vine.any().nullable())),
  })
)
