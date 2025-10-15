import { createError } from '@adonisjs/core/exceptions'

export const E_INVALID_VIEWPORT = createError('Invalid viewport', 'E_INVALID_VIEWPORT', 400)
export const E_ENABLE_TO_TAKE_SCREENSHOT = createError(
  'Enable to take screenshot',
  'E_ENABLE_TO_TAKE_SCREENSHOT',
  400
)
