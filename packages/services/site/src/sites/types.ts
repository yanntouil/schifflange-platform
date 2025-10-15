import { WithSeo } from "../seos/types"
import {
  Article,
  Page,
  Project,
  ProjectStep,
  WithArticleCategory,
  WithContent,
  WithProjectCategory,
  WithProjectCreatedBy,
  WithPublication,
  WithSlug,
} from "../types"

/**
 * responses
 */
export type PageResponse = PageBaseResponse &
  (PageResponsePage | PageResponseArticle | PageResponseProject | PageResponseProjectStep | PageResponseRedirect)
export type PageBaseResponse = {
  path: string
  locale: string
}
export type PageResponsePage = {
  model: "page"
  page: Page & WithSeo & WithContent & WithSlug
}
export type PageResponseArticle = {
  model: "article"
  article: Article & WithArticleCategory & WithSeo & WithContent & WithPublication & WithSlug
}
export type PageResponseProject = {
  model: "project"
  project: Project & WithProjectCategory & WithProjectCreatedBy & WithSeo & WithContent & WithPublication & WithSlug
}
export type PageResponseProjectStep = {
  model: "project-step"
  projectStep: ProjectStep & WithSeo & WithContent & WithSlug
}
export type PageResponseRedirect = {
  redirect: string
}
export type PageResponseNotFound = PageBaseResponse & {
  name: "E_RESOURCE_NOT_FOUND"
  message: string
}
