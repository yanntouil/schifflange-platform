import { type Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type PagesService = Api.PagesService
export type PagesServiceContextType = {
  service: Api.PagesService
  serviceKey: string
  isAdmin: boolean
  routeToPages: () => string
  routeToPage: (pageId: string) => string
  makeUrl: (page: Api.PageWithRelations, code?: string) => string
}

/**
 * contexts
 */
export const PagesServiceContext = createContext<PagesServiceContextType | null>(null)

/**
 * hooks
 */
export const usePagesService = () => {
  const context = useContext(PagesServiceContext)
  if (!context) {
    throw new Error("usePagesService must be used within a PagesServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
