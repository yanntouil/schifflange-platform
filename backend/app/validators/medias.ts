import env from '#start/env'
import vine from '@vinejs/vine'

export const sortByValidator = vine.compile(
  vine.object({
    field: vine.enum(['name', 'createdAt', 'updatedAt']).optional(),
    direction: vine.enum(['desc', 'asc']).optional(),
  })
)
export const filterByValidator = vine.compile(
  vine.object({
    isTemplate: vine.boolean().optional(),
  })
)

export const createFileValidator = vine.compile(
  vine.object({
    folderId: vine
      .string()
      .trim()
      .uuid()
      .exists({ table: 'media_folders', column: 'id' })
      .nullable()
      .optional(),
    file: vine.file({
      size: env.get('FILES_MAX_SIZE'),
    }),
  })
)

export const cropFileValidator = vine.compile(
  vine.object({
    transform: vine.object({
      width: vine.number(),
      height: vine.number(),
      x: vine.number(),
      y: vine.number(),
      rotate: vine.number(),
      cropper: vine.object({
        zoom: vine.number(),
        crop: vine.object({
          x: vine.number(),
          y: vine.number(),
        }),
        aspect: vine.object({
          w: vine.number(),
          h: vine.number(),
        }),
      }),
    }),
  })
)

export const updateFileValidator = vine.compile(
  vine.object({
    folderId: vine
      .string()
      .trim()
      .uuid()
      .exists({ table: 'media_folders', column: 'id' })
      .nullable()
      .optional(),
    file: vine
      .file({
        size: env.get('FILES_MAX_SIZE'),
      })
      .optional(),
    copyright: vine.string().trim().maxLength(255).optional(),
    copyrightLink: vine.string().trim().maxLength(255).optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().trim().maxLength(255).optional(),
          caption: vine.string().trim().maxLength(255).optional(),
          alt: vine.string().trim().maxLength(255).optional(),
        })
      )
      .optional(),
  })
)

export const createFolderValidator = vine.compile(
  vine.object({
    parentId: vine
      .string()
      .trim()
      .uuid()
      .exists({ table: 'media_folders', column: 'id' })
      .nullable()
      .optional(),
    name: vine.string().trim().maxLength(255),
    lock: vine.boolean().optional(),
  })
)

export const updateFolderValidator = vine.compile(
  vine.object({
    parentId: vine
      .string()
      .trim()
      .uuid()
      .exists({ table: 'media_folders', column: 'id' })
      .nullable()
      .optional(),
    name: vine.string().trim().maxLength(255).optional(),
    lock: vine.boolean().optional(),
  })
)
