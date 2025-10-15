import vine from '@vinejs/vine'
const formats = { utc: true }

export const updatePublicationValidator = vine.compile(
  vine.object({
    publishedById: vine.string().uuid().optional().nullable(),
    publishedAt: vine.date({ formats }).optional().nullable(),
    publishedFrom: vine.date({ formats }).optional().nullable(),
    publishedTo: vine.date({ formats }).optional().nullable(),
  })
)
