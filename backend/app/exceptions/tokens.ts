import { createError } from '@adonisjs/core/exceptions'

export const E_INVALID_TOKEN = createError(
  'the token use to perform this action is invalid',
  'E_INVALID_TOKEN',
  401
)
export const E_TOKEN_EXPIRED = createError(
  'the token use to perform this action is expired',
  'E_TOKEN_EXPIRED',
  401
)
