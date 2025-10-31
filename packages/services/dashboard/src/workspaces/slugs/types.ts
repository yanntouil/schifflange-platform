import { slugs } from "."
import { WithSeo } from "../../seos/types"
import { Article } from "../articles/types"
import { Event } from "../events/types"
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

export type SlugModel = "page" | "article" | "event"

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
export type WithEvent = {
  model: "event"
  event: Event & WithSeo
}
export type WithModel = WithPage | WithArticle | WithEvent

export type WithSlug = {
  slug: Slug
}
export type SlugsService = ReturnType<typeof slugs>
