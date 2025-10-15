import { MakeRequestOptions } from "../../types"
import { ProjectState, ProjectStepState, ProjectStepType, ProjectTagTranslation, ProjectTagType } from "./types"

/**
 * Query
 */
export type Projects = MakeRequestOptions<
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
  location?: string
  state?: ProjectState
  categoryId?: string | null
  tagId?: string | null
}

export type Update = {
  location?: string
  state?: ProjectState
  categoryId?: string | null
  tagId?: string | null
}

export type CreateStep = {
  type: ProjectStepType
  state?: ProjectStepState
}
export type UpdateStep = {
  state?: ProjectStepState
}

export type CreateCategory = {
  translations?: Record<string, CategoryTranslation>
}

export type UpdateCategory = {
  translations?: Record<string, CategoryTranslation>
}

export type CreateTag = {
  type: ProjectTagType
  translations?: Record<string, ProjectTagTranslation>
}

export type UpdateTag = {
  type: ProjectTagType
  translations?: Record<string, ProjectTagTranslation>
}

type CategoryTranslation = {
  title?: string
  description?: string
  imageId?: string | null
}
