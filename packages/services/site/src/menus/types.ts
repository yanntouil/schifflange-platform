import { MediaFile, Slug, SlugResource } from "../types"

export type Menu = {
  id: string
  name: string
  location: "header" | "footer"
}

export type MenuItem = {
  id: string
  order: number
  parentId: string | null
  props: Record<string, unknown>
  files: MediaFile[]
}

export type MenuItemLink = MenuItem & {
  type: "link"
  props: { link: string }
  translations: MenuItemTranslation
}
export type MenuItemResource = MenuItem & {
  type: "resource"
  slug: Slug
  translations: MenuItemTranslation
}
export type MenuItemUrl = MenuItem & {
  type: "url"
  translations: MenuItemTranslation<{ url: string }>
}
export type MenuItemGroup = MenuItem & {
  type: "group"
  items: MenuItemWithRelations[]
  translations: MenuItemTranslation
  // props: { link: string }
}

export type MenuItemWithRelations = MenuItemLink | MenuItemResource | MenuItemUrl | MenuItemGroup

export type MenuItemTranslation<T extends Record<string, unknown> = {}> = {
  name: string
  description: string
  props: T
}

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
  slug: SlugResource | null
}

export type WithMenuItemParent = {
  parent: MenuItem | null
}

export type WithMenuItemChildren = {
  children: MenuItem[]
}
