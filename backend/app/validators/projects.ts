import { projectStates } from '#models/project'
import { projectStepStates, projectStepTypes } from '#models/project-step'
import { projectTagType } from '#models/project-tag'
import vine from '@vinejs/vine'

// projects
export const createProjectValidator = vine.compile(
  vine.object({
    state: vine.enum(projectStates).optional(),
    location: vine.string().optional(),
    categoryId: vine.string().uuid().optional().nullable(),
    tagId: vine.string().uuid().optional().nullable(),
  })
)
export const updateProjectValidator = vine.compile(
  vine.object({
    state: vine.enum(projectStates).optional(),
    location: vine.string().optional(),
    categoryId: vine.string().uuid().optional().nullable(),
    tagId: vine.string().uuid().optional().nullable(),
  })
)
export const sortProjectsByValidator = vine.compile(
  vine.object({
    field: vine.enum(['name', 'createdAt', 'updatedAt', 'publishedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterProjectsByValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()).optional(),
    years: vine.array(vine.string()).optional(),
    tags: vine.array(vine.string().uuid()).optional(),
    in: vine.array(vine.string().uuid()).optional(),
  })
)

// project steps
export const createProjectStepValidator = vine.compile(
  vine.object({
    type: vine.enum(projectStepTypes),
    state: vine.enum(projectStates).optional(),
  })
)
export const updateProjectStepValidator = vine.compile(
  vine.object({
    state: vine.enum(projectStepStates).optional(),
  })
)

// project categories
export const createProjectCategoryValidator = vine.compile(
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
export const updateProjectCategoryValidator = vine.compile(
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
export const reorderProjectCategoriesValidator = vine.compile(
  vine.object({
    categories: vine.array(vine.string().uuid()),
  })
)
export const sortProjectCategoriesByValidator = vine.compile(
  vine.object({
    field: vine.enum(['createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterProjectCategoriesByValidator = vine.compile(
  vine.object({
    //
  })
)

// project tags
export const createProjectTagValidator = vine.compile(
  vine.object({
    type: vine.enum(projectTagType),
    order: vine.number().optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().optional(),
        })
      )
      .optional(),
  })
)
export const updateProjectTagValidator = vine.compile(
  vine.object({
    type: vine.enum(projectTagType).optional(),
    order: vine.number().optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().optional(),
        })
      )
      .optional(),
  })
)
