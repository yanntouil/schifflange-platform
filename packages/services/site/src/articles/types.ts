import { MediaFile } from "../medias/types"
import { MakeRequestOptions, PaginationMeta } from "../types"

/**
 * Query
 */
export type ArticlesQuery = MakeRequestOptions<
  "name" | "createdAt" | "updatedAt" | "publishedAt",
  {
    categories?: string[]
    in?: string[]
    isPublished?: boolean
  }
>

/**
 * response
 */
export type ArticlesResponse = {
  locale: string
  articles: Article[]
  categories: ArticleCategory[]
}
export type ArticlesByPageResponse = {
  locale: string
  articles: Article[]
  categories: ArticleCategory[]
  metadata: PaginationMeta
  filterBy: ArticlesQuery["filterBy"]
  sortBy: ArticlesQuery["sortBy"]
}
export type ArticlesLatestResponse = {
  locale: string
  article: Article | null
}

/**
 * articles
 */
export type Article = {
  id: string
  trackingId: string
}

/**
 * article categories
 */
export type ArticleCategory = {
  id: string
  order: number
  translations: ArticleCategoryTranslation
}
export type ArticleCategoryTranslation = {
  title: string
  description: string
  image: MediaFile | null
}

/**
 * relations
 */
export type WithArticleCategory = {
  category: ArticleCategory | null
}
