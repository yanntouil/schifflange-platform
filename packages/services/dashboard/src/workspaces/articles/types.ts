import { articles } from "."
import { WithContent } from "../../contents/types"
import { WithPublication } from "../../publications/types"
import { WithSeo } from "../../seos/types"
import { WithTracking } from "../../trackings/types"
import { MediaFile, Translatable, User } from "../../types"
import { WithSlug } from "../slugs/types"

export type ArticleState = "draft" | "published"

export type Article = {
  id: string
  state: ArticleState
  workspaceId: string
  categoryId: string | null
  category: ArticleCategory | null
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
export type ArticleWithRelations = Article & WithSeo & WithContent & WithSlug & WithTracking & WithPublication

export type ArticleCategory = {
  id: string
  order: number
  workspaceId: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
  totalArticles?: number
} & Translatable<ArticleCategoryTranslation>

export type WithArticles = {
  articles: Article[]
}

export type ArticleCategoryTranslation = {
  languageId: string
  title: string
  description: string
  image: MediaFile | null
}
export type ArticlesService = ReturnType<typeof articles>
