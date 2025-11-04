import { Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type CouncilsService = Api.CouncilsService
export type CouncilsServiceContextType = {
  service: Api.CouncilsService
  serviceKey: string
  isAdmin: boolean
  routesTo: {
    list: () => string
  }
}

/**
 * contexts
 */
export const CouncilsServiceContext = createContext<CouncilsServiceContextType | null>(null)

/**
 * hooks
 */
export const useCouncilsService = () => {
  const context = useContext(CouncilsServiceContext)
  if (!context) {
    throw new Error("useCouncilsService must be used within a CouncilsServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
