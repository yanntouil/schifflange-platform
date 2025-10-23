import vine from '@vinejs/vine'

export const createLibraryDocumentValidator = vine.compile(
  vine.object({
    reference: vine.string(),
    files: vine
      .array(
        vine.object({
          fileId: vine.string().uuid(),
          code: vine.string().optional().nullable(),
        })
      )
      .optional(),
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const updateLibraryDocumentValidator = vine.compile(
  vine.object({
    reference: vine.string().optional(),
    files: vine
      .array(
        vine.object({
          fileId: vine.string().uuid(),
          code: vine.string().optional().nullable(),
        })
      )
      .optional(),
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),
  })
)

export const sortLibraryDocumentsByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt', 'reference']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterLibraryDocumentsByValidator = vine.compile(vine.object({}))
