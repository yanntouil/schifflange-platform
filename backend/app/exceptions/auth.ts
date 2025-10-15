import { createError } from '@adonisjs/core/exceptions'

export const E_ACCOUNT_NOT_ACTIVE = createError(
  'you need to have an active account to perform this action',
  'E_ACCOUNT_NOT_ACTIVE',
  403
)
export const E_UNAUTHENTICATED_ACCESS = createError(
  'you you need to be unauthenticated to perform this action',
  'E_UNAUTHENTICATED_ACCESS',
  403
)
export const E_UNAUTHORIZED_ACCESS = createError(
  'you need to be authenticated to perform this action',
  'E_UNAUTHORIZED_ACCESS',
  401
)
export const E_ACCOUNT_DELETED = createError('your account is deleted', 'E_ACCOUNT_DELETED', 403)
export const E_EMAIL_ALREADY_EXISTS = createError(
  'the email you are trying to use is already taken',
  'E_EMAIL_ALREADY_EXISTS',
  400
)
export const E_ACCOUNT_SUSPENDED = createError(
  'your account is suspended',
  'E_ACCOUNT_SUSPENDED',
  403
)
export const E_SESSION_NOT_FOUND = createError(
  'the session you are trying to deactivate does not exist',
  'E_SESSION_NOT_FOUND',
  404
)
export const E_FORGOT_PASSWORD_LIMIT_EXCEEDED = createError(
  'you have already requested a password reset in the last hour',
  'E_FORGOT_PASSWORD_LIMIT_EXCEEDED',
  400
)
