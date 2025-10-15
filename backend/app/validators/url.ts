import vine from '@vinejs/vine'

export const urlValidator = vine.compile(
  vine.object({
    url: vine.string().url().trim(),
  })
)
