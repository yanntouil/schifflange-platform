import { slugs } from "."
import { WithSeo } from "../../seos/types"
import { Article } from "../articles/types"
import { Forward } from "../forwards/types"
import { Page } from "../pages/types"
import { Project, ProjectStep } from "../projects/types"

export type Slug = {
  id: string
  slug: string
  path: string
  workspaceId: string
  createdAt: string
  updatedAt: string
  model: SlugModel
}

export type SlugModel = "page" | "article" | "project" | "project-step"

export type WithForward = {
  forwards: Forward[]
}

export type WithSlugProject = {
  model: "project"
  project: Project & WithSeo
}
export type WithProjectStep = {
  model: "project-step"
  projectStep: ProjectStep & WithSeo
}
export type WithPage = {
  model: "page"
  page: Page & WithSeo
}
export type WithArticle = {
  model: "article"
  article: Article & WithSeo
}
export type WithModel = WithSlugProject | WithProjectStep | WithPage | WithArticle

export type WithSlug = {
  slug: Slug
}
export type SlugsService = ReturnType<typeof slugs>
