import vine from '@vinejs/vine'

export const updatePinValidator = vine.compile(
  vine.object({
    pin: vine.boolean().optional(),
  })
)
export const reorderPinsValidator = vine.compile(
  vine.object({
    pins: vine.array(vine.string().uuid()),
  })
)
