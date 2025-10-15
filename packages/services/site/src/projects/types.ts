import { MediaFile } from "../medias/types"
import { MakeRequestOptions, PaginationMeta, Publication, Seo, Slug } from "../types"
import { User } from "../users/types"

/**
 * Query
 */
export type ProjectsQuery = MakeRequestOptions<
  "name" | "createdAt" | "updatedAt" | "publishedAt",
  {
    categories?: string[]
    years?: string[]
    tags?: string[]
    in?: string[]
  }
>

/**
 * response
 */
export type ProjectsResponse = {
  locale: string
  projects: Project[]
  categories: ProjectCategory[]
}
export type ProjectsByPageResponse = {
  locale: string
  projects: Project[]
  categories: ProjectCategory[]
  metadata: PaginationMeta
  filterBy: ProjectsQuery["filterBy"]
  sortBy: ProjectsQuery["sortBy"]
}
export type ProjectsLatestResponse = {
  locale: string
  project: Project | null
}
export type ProjectsCategoriesResponse = {
  locale: string
  categories: ProjectCategory[]
}
export type ProjectsTagsResponse = {
  locale: string
  tags: ProjectTag[]
}
export type ProjectsYearsResponse = {
  locale: string
  years: string[]
}

/**
 * projects
 */
export type Project = {
  id: string
  trackingId: string
  location: string
  category: ProjectCategory | null
  tag: ProjectTag | null
  seo: Seo
  slug: Slug
  publication: Publication
}

export type ProjectStep = {
  id: string
  trackingId: string
  seo: Seo
  slug: Slug
}
/**
 * project categories
 */
export type ProjectCategory = {
  id: string
  order: number
  translations: ProjectCategoryTranslation
}
export type ProjectCategoryTranslation = {
  title: string
  description: string
  image: MediaFile | null
}

/**
 * project tags
 */
export type ProjectTag = {
  id: string
  order: number
  type: ProjectTagType
  workspaceId: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
  totalProjects?: number
  translations: ProjectTagTranslation
}
export type ProjectTagTranslation = {
  languageId: string
  name: string
}
export type ProjectTagType = "non-formal-education" | "child-family-services"
/**
 * relations
 */
export type WithProjectCategory = {
  category: ProjectCategory | null
}
export type WithProjectCreatedBy = {
  createdBy: User | null
}
