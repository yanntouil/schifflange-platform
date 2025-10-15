import { createError } from '@adonisjs/core/exceptions'

export const E_MEDIA_UPLOAD_FAILED = createError(
  'Unable to upload media',
  'E_MEDIA_UPLOAD_FAILED',
  400
)
export const E_MEDIA_COPY_FAILED = createError('Unable to copy media', 'E_MEDIA_COPY_FAILED', 400)
export const E_MEDIA_CROP_FAILED = createError('Unable to crop media', 'E_MEDIA_CROP_FAILED', 400)
export const E_MEDIA_UNCROP_FAILED = createError(
  'Unable to uncrop media',
  'E_MEDIA_UNCROP_FAILED',
  400
)
