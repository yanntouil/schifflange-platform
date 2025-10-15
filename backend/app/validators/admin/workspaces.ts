import { workspaceRoles, workspaceStatuses, workspaceTypes } from '#models/workspace'
import env from '#start/env'
import vine from '@vinejs/vine'

export const createWorkspaceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    themeId: vine.string().uuid().exists({ table: 'workspace_themes', column: 'id' }).optional(),
    status: vine.enum(workspaceStatuses).optional(),
    config: vine.record(vine.record(vine.any().nullable())).optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional()
      .nullable(),
  })
)
export const updateWorkspaceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    themeId: vine
      .string()
      .uuid()
      .exists({ table: 'workspace_themes', column: 'id' })
      .nullable()
      .optional(),
    status: vine.enum(workspaceStatuses).optional(),
    type: vine.enum(workspaceTypes).optional(),
    config: vine.record(vine.record(vine.any().nullable())).optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional()
      .nullable(),
    noEmit: vine.boolean().optional(),
  })
)

export const updateMemberValidator = vine.compile(
  vine.object({
    role: vine.enum(workspaceRoles),
  })
)
export const attachMemberValidator = vine.compile(
  vine.object({
    role: vine.enum(workspaceRoles),
  })
)
export const createInvitationValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(255),
    language: vine.string().trim().maxLength(255).optional(),
    role: vine.enum(workspaceRoles).optional(),
  })
)
export const filterWorkspacesValidator = vine.compile(
  vine.object({
    status: vine.enum(workspaceStatuses).optional(),
    type: vine.enum(workspaceTypes).optional(),
  })
)
export const sortWorkspacesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['name', 'status', 'createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const createThemeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().maxLength(1000).optional(),
    isDefault: vine.boolean().optional(),
    config: vine.record(vine.any().nullable()).optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional()
      .nullable(),
  })
)

export const updateThemeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().maxLength(1000).optional(),
    isDefault: vine.boolean().optional(),
    config: vine.record(vine.any().nullable()).optional(),
    image: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional()
      .nullable(),
  })
)

export const filterThemesValidator = vine.compile(
  vine.object({
    isDefault: vine.boolean().optional(),
  })
)

export const sortThemesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['name', 'isDefault']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
