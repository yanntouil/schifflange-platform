import { appendQS } from "@compo/utils"
import { Api } from "../api"
import { ArticlesByPageResponse, ArticlesLatestResponse, ArticlesQuery, ArticlesResponse } from "./types"

/**
 * articles service
 * Get articles with filtering, sorting, and pagination
 */
export const articles = (api: Api) => ({
  /**
   * Get all articles with optional filtering and sorting
   */
  all: (locale: string, query?: ArticlesQuery) => api.get<ArticlesResponse>(appendQS(`articles/${locale}`, query)),

  /**
   * Get paginated articles
   */
  byPage: (locale: string, query?: ArticlesQuery) =>
    api.get<ArticlesByPageResponse>(appendQS(`articles-by-page/${locale}`, query)),

  /**
   * Get the latest published article
   */
  latest: (locale: string, query?: ArticlesQuery) =>
    api.get<ArticlesLatestResponse>(appendQS(`articles-latest/${locale}`, query)),
})
