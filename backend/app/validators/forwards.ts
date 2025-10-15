import vine from '@vinejs/vine'

export const createForwardValidator = vine.compile(
  vine.object({
    path: vine.string().trim().maxLength(255),
    slugId: vine.string().uuid(),
  })
)

export const updateForwardValidator = vine.compile(
  vine.object({
    path: vine.string().trim().maxLength(255),
    slugId: vine.string().uuid(),
  })
)
