import vine from '@vinejs/vine'

/**
 * Validator for preview screenshot generation
 */
export const previewValidator = vine.compile(
  vine.object({
    url: vine.string().url(),
    screenshot: vine.boolean().optional(),
    colorScheme: vine.enum(['light', 'dark']).optional(),
    waitUntilTimeout: vine.number().min(0).max(10000).optional(),
    viewport: vine
      .object({
        isMobile: vine.boolean().optional(),
        deviceScaleFactor: vine.number().min(0.5).max(3).optional(),
        width: vine.number().min(320).max(3840).optional(),
        height: vine.number().min(240).max(2160).optional(),
      })
      .optional(),
  })
)