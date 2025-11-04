import { vineVideoType } from '#services/video'
import vine from '@vinejs/vine'
const formats = { utc: true }

export const createCouncilValidator = vine.compile(
  vine.object({
    date: vine.date({ formats }),
    video: vineVideoType.optional(),
    translations: vine
      .record(
        vine.object({
          agenda: vine.string().optional(),
          reportId: vine
            .string()
            .trim()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
)

export const updateCouncilValidator = vine.compile(
  vine.object({
    date: vine.date({ formats }).optional(),
    video: vineVideoType.optional(),
    translations: vine
      .record(
        vine.object({
          agenda: vine.string().optional(),
          reportId: vine
            .string()
            .trim()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
)

export const sortCouncilsByValidator = vine.compile(
  vine.object({
    field: vine.enum(['date', 'createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)

export const filterCouncilsByValidator = vine.compile(
  vine.object({
    in: vine.array(vine.string().uuid()).optional(),
    dateFrom: vine.date({ formats }).optional(),
    dateTo: vine.date({ formats }).optional(),
  })
)
