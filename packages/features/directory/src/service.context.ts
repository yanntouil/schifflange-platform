import { Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type DirectoryService = Api.DirectoryService
export type DirectoryServiceContextType = {
  service: Api.DirectoryService
  serviceKey: string
  isAdmin: boolean
  organisationType?: Api.OrganisationType
  organisationId?: string | null
  routesTo: {
    contacts: {
      list: () => string
      byId: (contactId: string) => string
    }
    organizations: {
      list: () => string
      byId: (organizationId: string) => string
    }
  }
}

/**
 * contexts
 */
export const DirectoryServiceContext = createContext<DirectoryServiceContextType | null>(null)

/**
 * hooks
 */
export const useDirectoryService = () => {
  const context = useContext(DirectoryServiceContext)
  if (!context) {
    throw new Error("useDirectoryService must be used within a DirectoryServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
