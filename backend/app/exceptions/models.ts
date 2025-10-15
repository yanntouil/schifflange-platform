import { createError } from '@adonisjs/core/exceptions'

export const E_UNLOADED_RELATION = createError('relation is not loaded', 'E_UNLOADED_RELATION', 500)
