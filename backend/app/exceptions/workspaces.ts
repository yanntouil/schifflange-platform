import { createError } from '@adonisjs/core/exceptions'

export const E_WORKSPACE_NOT_ALLOWED = createError(
  'Access to the workspace is not authorized.',
  'E_WORKSPACE_ACCESS_DENIED',
  403
)

export const E_WORKSPACE_NOT_ACTIVE = createError(
  'The workspace is not active.',
  'E_WORKSPACE_NOT_ACTIVE',
  403
)

export const E_WORKSPACE_ADMIN_REQUIRED = createError(
  'Admin permissions required to perform this action.',
  'E_WORKSPACE_ADMIN_REQUIRED',
  403
)

export const E_WORKSPACE_PERMISSION_DENIED = createError(
  'You do not have the necessary permissions to perform this action.',
  'E_WORKSPACE_PERMISSION_DENIED',
  403
)
export const E_WORKSPACE_OWNER_REQUIRED = createError(
  'Owner permissions required to perform this action.',
  'E_WORKSPACE_OWNER_REQUIRED',
  403
)
export const E_WORKSPACE_MEMBER_REQUIRED = createError(
  'Member permissions required to perform this action.',
  'E_WORKSPACE_MEMBER_REQUIRED',
  403
)
export const E_WORKSPACE_NOT_FOUND = createError(
  'Workspace not found.',
  'E_WORKSPACE_NOT_FOUND',
  400
)
