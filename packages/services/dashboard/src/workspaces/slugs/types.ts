import { slugs } from "."
import { WithSeo } from "../../seos/types"
import { Article } from "../articles/types"
import { Forward } from "../forwards/types"
import { Page } from "../pages/types"

export type Slug = {
  id: string
  slug: string
  path: string
  workspaceId: string
  createdAt: string
  updatedAt: string
  model: SlugModel
}

export type SlugModel = "page" | "article"

export type WithForward = {
  forwards: Forward[]
}

export type WithPage = {
  model: "page"
  page: Page & WithSeo
}
export type WithArticle = {
  model: "article"
  article: Article & WithSeo
}
export type WithModel = WithPage | WithArticle

export type WithSlug = {
  slug: Slug
}
export type SlugsService = ReturnType<typeof slugs>
