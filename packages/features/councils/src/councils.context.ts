import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageCouncils } from "./councils.context.actions"
import { SWRCouncils } from "./swr.councils"

/**
 * types
 */
export type CouncilsContextType = Selectable<Api.Council> & {
  contextId: string
  swr: SWRCouncils
} & ManageCouncils

/**
 * contexts
 */
export const CouncilsContext = React.createContext<CouncilsContextType | null>(null)

/**
 * hooks
 */
export const useCouncils = () => {
  const context = React.useContext(CouncilsContext)
  if (!context) throw new Error("useCouncils must be used within a CouncilsProvider")
  return context
}
