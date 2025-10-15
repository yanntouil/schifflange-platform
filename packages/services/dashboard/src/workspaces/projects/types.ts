import { projects } from "."
import { WithContent } from "../../contents/types"
import { WithPublication } from "../../publications/types"
import { WithSeo } from "../../seos/types"
import { WithTracking } from "../../trackings/types"
import { MediaFile, Translatable, User } from "../../types"
import { WithSlug } from "../slugs/types"

export type ProjectState = "draft" | "published"

export type Project = {
  id: string
  state: ProjectState
  location: string
  workspaceId: string
  categoryId: string | null
  category: ProjectCategory | null
  tagId: string | null
  tag: ProjectTag | null
  seoId: string
  contentId: string
  trackingId: string
  slugId: string
  publicationId: string | null
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
}
export type WithSteps = {
  steps: (ProjectStep & WithSeo & WithContent & WithSlug & WithTracking)[]
}
export type ProjectWithRelations = Project &
  WithSeo &
  WithContent &
  WithSlug &
  WithTracking &
  WithPublication &
  WithSteps

export type ProjectStepState = "draft" | "published"
export type ProjectStepType = "consultation" | "incubation" | "scaling"
export type ProjectStep = {
  id: string
  state: ProjectStepState
  type: ProjectStepType
  workspaceId: string
  projectId: string
  project: Project
  seoId: string
  contentId: string
  trackingId: string
  slugId: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
}
export type WithProject = {
  project: Project
}
export type ProjectStepWithRelations = ProjectStep & WithSeo & WithContent & WithSlug & WithTracking & WithProject

export type ProjectCategory = {
  id: string
  order: number
  workspaceId: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
  totalProjects?: number
} & Translatable<ProjectCategoryTranslation>

export type WithProjects = {
  projects: Project[]
}

export type ProjectCategoryTranslation = {
  languageId: string
  title: string
  description: string
  image: MediaFile | null
}
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
} & Translatable<ProjectTagTranslation>
export type ProjectTagTranslation = {
  languageId: string
  name: string
}
export type ProjectTagType = "non-formal-education" | "child-family-services"
export type ProjectsService = ReturnType<typeof projects>
