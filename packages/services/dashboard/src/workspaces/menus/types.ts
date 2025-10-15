import { menus } from "."
import { MediaFile, Slug, User, WithModel } from "../../types"

export type Menu = {
  id: string
  name: string
  location: "header" | "footer"
}

export type MenuItem = {
  id: string
  order: number
  state: MenuItemState
  type: string
  parentId: string | null
  props: Record<string, unknown>
  files: MediaFile[]
  createdBy: User | null // no available in public
  createdAt: string // no available in public
  updatedBy: User | null
  updatedAt: string // no available in public
}
export type MenuItemWithRelations = MenuItem & WithMenuTranslations & WithMenuItemSlug

export type MenuItemTranslation = {
  languageId: string
  name: string
  description: string
  props: Record<string, unknown>
}

export type MenuItemState = "draft" | "published"

export type WithMenuItems = {
  items: (MenuItem & WithMenuTranslations & WithMenuItemSlug)[]
}

export type WithMenu = {
  menu: Menu
}

export type WithMenuTranslations = {
  translations: MenuItemTranslation[]
}

export type WithMenuItemSlug = {
  slug: (Slug & WithModel) | null
}

export type WithMenuItemParent = {
  parent: MenuItem | null
}

export type WithMenuItemChildren = {
  children: MenuItem[]
}

export type MenusService = ReturnType<typeof menus>
