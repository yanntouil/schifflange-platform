import { Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type ArticlesService = Api.ArticlesService
export type ArticlesServiceContextType = {
  service: Api.ArticlesService
  serviceKey: string
  isAdmin: boolean
  routeToCategories: () => string
  routeToArticles: () => string
  routeToArticle: (articleId: string) => string
  makeUrl: (article: Api.ArticleWithRelations, code?: string) => string
}

/**
 * contexts
 */
export const ArticlesServiceContext = createContext<ArticlesServiceContextType | null>(null)

/**
 * hooks
 */
export const useArticlesService = () => {
  const context = useContext(ArticlesServiceContext)
  if (!context) {
    throw new Error("useArticlesService must be used within a ArticlesServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
