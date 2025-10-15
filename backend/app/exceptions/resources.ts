import { createError } from '@adonisjs/core/exceptions'

export const E_RESOURCE_NOT_FOUND = createError(
  'the resource you are looking for does not exist',
  'E_RESOURCE_NOT_FOUND',
  404
)
export const E_RESOURCE_NOT_ALLOWED = createError(
  'you are not allowed to access this resource',
  'E_RESOURCE_NOT_ALLOWED',
  403
)
export const E_RESOURCE_LOCKED = createError('the resource is locked', 'E_RESOURCE_LOCKED', 403)
