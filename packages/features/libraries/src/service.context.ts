import { Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type LibrariesService = Api.LibrariesService
export type LibrariesServiceContextType = {
  service: Api.LibrariesService
  serviceKey: string
  isAdmin: boolean
  libraryId?: string | null
  routesTo: {
    list: () => string
    byId: (libraryId: string) => string
  }
}

/**
 * contexts
 */
export const LibrariesServiceContext = createContext<LibrariesServiceContextType | null>(null)

/**
 * hooks
 */
export const useLibrariesService = () => {
  const context = useContext(LibrariesServiceContext)
  if (!context) {
    throw new Error("useLibrariesService must be used within a LibrariesServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
