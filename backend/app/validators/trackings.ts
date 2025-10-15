import vine from '@vinejs/vine'

export const traceValidator = vine.compile(
  vine.object({
    sessionId: vine.string().trim().uuid().optional(),
    traceId: vine.string().trim().uuid().optional(),
  })
)
