import { Article } from "../articles/types"
import { Page } from "../pages/types"
import { Project, ProjectStep } from "../projects/types"
import { WithSeo } from "../seos/types"

/**
 * response
 */
export type SlugsResponse = {
  paths: string[]
  forwards: string[]
  pages: string[]
}

/**
 * slug
 */
export type Slug = {
  id: string
  path: string
}
export type SlugResource = SlugPage | SlugArticle | SlugProject | SlugProjectStep
export type SlugPage = {
  id: string
  model: "page"
  page: Page & WithSeo
}
export type SlugArticle = {
  id: string
  model: "article"
  article: Article & WithSeo
}
export type SlugProject = {
  id: string
  model: "project"
  project: Project & WithSeo
}
export type SlugProjectStep = {
  id: string
  model: "project-step"
  projectStep: ProjectStep & WithSeo
}
export type WithSlug = {
  slug: Slug
}
