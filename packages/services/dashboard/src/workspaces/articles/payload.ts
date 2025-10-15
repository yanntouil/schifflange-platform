import { MakeRequestOptions } from "../../types"
import { ArticleState } from "./types"

/**
 * Query
 */
export type Articles = MakeRequestOptions<
  "name" | "createdAt" | "updatedAt" | "publishedAt",
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
  state?: ArticleState
  categoryId?: string | null
}

export type Update = {
  state?: ArticleState
  categoryId?: string | null
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
