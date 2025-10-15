import vine from '@vinejs/vine'

export const updateSlugValidator = vine.compile(
  vine.object({
    slug: vine.string().trim().maxLength(255),
    path: vine.string().trim().maxLength(255),
  })
)
