import { createError } from '@adonisjs/core/exceptions'

export const E_FORBIDDEN_ACCESS = createError(
  'this resource is not accessible',
  'E_FORBIDDEN_ACCESS',
  403
)
