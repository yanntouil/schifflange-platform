import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageOrganisations } from "./organisations.context.actions"
import { SWROrganisations } from "./swr.organisations"

/**
 * types
 */
export type OrganisationsContextType = Selectable<Api.Organisation> & {
  contextId: string
  swr: SWROrganisations
} & ManageOrganisations

/**
 * contexts
 */
export const OrganisationsContext = React.createContext<OrganisationsContextType | null>(null)

/**
 * hooks
 */
export const useOrganisations = () => {
  const context = React.useContext(OrganisationsContext)
  if (!context) throw new Error("useOrganisations must be used within a OrganisationsProvider")
  return context
}
