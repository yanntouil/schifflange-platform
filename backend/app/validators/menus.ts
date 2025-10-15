import { menuItemStates } from '#models/menu-item'
import vine from '@vinejs/vine'

export const createMenuValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    location: vine.string().optional(),
  })
)

export const updateMenuValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    location: vine.string().optional(),
  })
)

export const createMenuItemValidator = vine.compile(
  vine.object({
    parentId: vine.string().uuid().optional(),
    state: vine.enum(menuItemStates).optional(),
    type: vine.string().optional(),
    slugId: vine.string().uuid().optional().nullable(),
    order: vine.number().optional(),
    props: vine.record(vine.any().nullable()).optional(),
    files: vine
      .array(vine.string().uuid().exists({ table: 'media_files', column: 'id' }))
      .optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().optional(),
          description: vine.string().optional(),
          props: vine.record(vine.any().nullable()).optional(),
        })
      )
      .optional(),
  })
)

export const updateMenuItemValidator = vine.compile(
  vine.object({
    state: vine.enum(menuItemStates).optional(),
    slugId: vine.string().uuid().nullable().optional(),
    type: vine.string().optional(),
    props: vine.record(vine.any().nullable()).optional(),
    files: vine
      .array(vine.string().uuid().exists({ table: 'media_files', column: 'id' }))
      .optional(),
    translations: vine
      .record(
        vine.object({
          name: vine.string().optional(),
          description: vine.string().optional(),
          props: vine.record(vine.any().nullable()).optional(),
        })
      )
      .optional(),
  })
)

export const reorderMenuItemsValidator = vine.compile(
  vine.object({
    items: vine.array(vine.string().uuid()),
  })
)

export const moveMenuItemValidator = vine.compile(
  vine.object({
    parentId: vine.string().uuid().optional(),
    menuId: vine.string().uuid().optional(),
  })
)
