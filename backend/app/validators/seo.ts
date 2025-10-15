import vine from '@vinejs/vine'

export const updateSeoValidator = vine.compile(
  vine.object({
    files: vine
      .array(vine.string().trim().uuid().exists({ table: 'media_files', column: 'id' }))
      .optional(),
    translations: vine
      .record(
        vine.object({
          title: vine.string().trim().maxLength(255).optional(),
          description: vine.string().trim().maxLength(1024).optional(),
          keywords: vine.array(vine.string().trim().maxLength(255)).optional(),
          imageId: vine
            .string()
            .trim()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
          socials: vine.array(
            vine.object({
              type: vine.string().trim().maxLength(255),
              title: vine.string().trim().maxLength(255),
              description: vine.string().trim().maxLength(255),
              imageId: vine
                .string()
                .trim()
                .uuid()
                .exists({ table: 'media_files', column: 'id' })
                .nullable(),
            })
          ),
        })
      )
      .optional(),
  })
)
