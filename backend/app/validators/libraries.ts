import vine from '@vinejs/vine'

export const createLibraryValidator = vine.compile(
  vine.object({
    parentLibraryId: vine.string().uuid().optional().nullable(),
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

export const updateLibraryValidator = vine.compile(
  vine.object({
    parentLibraryId: vine.string().uuid().optional().nullable(),
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

export const sortLibrariesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterLibrariesByValidator = vine.compile(vine.object({}))
