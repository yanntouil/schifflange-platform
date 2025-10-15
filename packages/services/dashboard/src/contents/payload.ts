import { ContentItemState } from "./types"

/**
 * payloads
 */
export type Update = {
  //
}

export type CreateItem = {
  files?: string[]
  slugs?: string[]
  order?: number
  type?: string
  state?: ContentItemState
  props?: Record<string, unknown>
  translations?: Record<string, { props?: Record<string, unknown> }>
}

export type UpdateItem = {
  files?: string[] // used in props and translations[number].props
  slugs?: string[]
  order?: number
  type?: string
  state?: ContentItemState
  props?: Record<string, unknown>
  translations?: Record<string, { props?: Record<string, unknown> }>
}

export type FromTemplate = {
  order?: number
  templateId: string
}

export type ReorderItem = {
  items: string[]
}
