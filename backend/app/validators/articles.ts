import { articleStates } from '#models/article'
import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    state: vine.enum(articleStates).optional(),
    categoryId: vine.string().uuid().optional().nullable(),
  })
)
export const updateArticleValidator = vine.compile(
  vine.object({
    state: vine.enum(articleStates).optional(),
    categoryId: vine.string().uuid().optional().nullable(),
  })
)
export const sortArticlesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['name', 'createdAt', 'updatedAt', 'publishedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterArticlesByValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()).optional(),
    in: vine.array(vine.string().uuid()).optional(),
    isPublished: vine.boolean().optional(),
  })
)

export const createArticleCategoryValidator = vine.compile(
  vine.object({
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
          imageId: vine
            .string()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
)
export const updateArticleCategoryValidator = vine.compile(
  vine.object({
    translations: vine
      .record(
        vine.object({
          title: vine.string().optional(),
          description: vine.string().optional(),
          imageId: vine
            .string()
            .uuid()
            .exists({ table: 'media_files', column: 'id' })
            .optional()
            .nullable(),
        })
      )
      .optional(),
  })
)
export const reorderArticleCategoriesValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()),
  })
)
export const sortArticleCategoriesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterArticleCategoriesByValidator = vine.compile(
  vine.object({
    //
  })
)
