import { type Api } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type SlugsServiceContextType = {
  service: Api.SlugsService
  serviceKey: string
  isAdmin: boolean
  makeUrl: (page: Api.Slug) => string
  routeToPage: (pageId: string) => string
  routeToArticle: (articleId: string) => string
  routeToProject: (projectId: string) => string
  routeToProjectStep: (projectId: string, projectStepId: string) => string
  makePath: Api.Service["makePath"]
  getImageUrl: Api.Service["getImageUrl"]
}

/**
 * contexts
 */
export const SlugsServiceContext = createContext<SlugsServiceContextType | null>(null)

/**
 * hooks
 */
export const useSlugsService = () => {
  const context = useContext(SlugsServiceContext)
  if (!context) {
    throw new Error("useSlugsService must be used within a SlugsServiceProvider")
  }
  return context
}
