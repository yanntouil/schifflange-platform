import { Selectable } from "@compo/hooks"
import { Api } from "@services/dashboard"
import React from "react"
import { ManageOrganisation } from "./organisation.context.actions"
import { SWRSafeOrganisation } from "./swr.organisation"

/**
 * types
 */
export type OrganisationContextType = Selectable<Api.ContactOrganisation> & {
  contextId: string
  swr: SWRSafeOrganisation
} & ManageOrganisation

/**
 * contexts
 */
export const OrganisationContext = React.createContext<OrganisationContextType | null>(null)

/**
 * hooks
 */
export const useOrganisation = () => {
  const context = React.useContext(OrganisationContext)
  if (!context) throw new Error("useOrganisation must be used within a OrganisationProvider")
  return context
}
