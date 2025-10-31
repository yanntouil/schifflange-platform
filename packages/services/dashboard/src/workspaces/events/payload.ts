import { MakeRequestOptions } from "../../types"
import { EventState, EventTranslation } from "./types"

/**
 * Query
 */
export type Events = MakeRequestOptions<
  "createdAt" | "updatedAt",
  {
    categories?: string[]
    in?: string[]
    isPublished?: boolean
  }
>
export type Categories = MakeRequestOptions<
  "createdAt" | "updatedAt",
  {
    //
  }
>

/**
 * Payloads
 */
export type Create = {
  state?: EventState
  categoryIds?: string[]
  props?: Record<string, unknown>
  translations?: Record<string, EventTranslation>
}

export type Update = {
  state?: EventState
  categoryIds?: string[]
  props?: Record<string, unknown>
  translations?: Record<string, EventTranslation>
}

export type CreateCategory = {
  translations?: Record<string, CategoryTranslation>
}

export type UpdateCategory = {
  translations?: Record<string, CategoryTranslation>
}

type CategoryTranslation = {
  title?: string
  description?: string
  imageId?: string | null
}
