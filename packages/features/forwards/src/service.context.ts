import { type Api } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type ForwardsServiceContextType = {
  service: Api.ForwardsService
  serviceKey: string
  isAdmin: boolean
  makeUrl: (slug: Api.Slug) => string
  routesTo: {
    pages: {
      byId: (pageId: string) => string
    }
    articles: {
      byId: (articleId: string) => string
    }
  }
  makePath: Api.Service["makePath"]
  getImageUrl: Api.Service["getImageUrl"]
}

/**
 * contexts
 */
export const ForwardsServiceContext = createContext<ForwardsServiceContextType | null>(null)

/**
 * hooks
 */
export const useForwardsService = () => {
  const context = useContext(ForwardsServiceContext)
  if (!context) {
    throw new Error("useForwardsService must be used within a ForwardsServiceProvider")
  }
  return context
}
