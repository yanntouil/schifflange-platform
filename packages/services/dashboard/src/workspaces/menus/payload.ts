import { MenuItemState } from "./types"

/**
 * payloads
 */
export type Create = {
  name?: string
  location?: string
}

export type Update = {
  name?: string
  location?: string
}

export type CreateItem = {
  parentId?: string | null
  state?: MenuItemState
  slugId?: string | null
  type?: string
  order?: number // or last
  props?: Record<string, unknown>
  files?: string[]
  translations?: Record<
    string,
    {
      name: string
      description: string
      props: Record<string, unknown>
    }
  >
}

export type UpdateItem = {
  state?: MenuItemState
  slugId?: string | null
  type?: string
  order?: number // or last
  props?: Record<string, unknown>
  files?: string[]
  translations?: Record<
    string,
    {
      name: string
      description: string
      props: Record<string, unknown>
    }
  >
}

export type ReorderItems = {
  items: string[]
}
