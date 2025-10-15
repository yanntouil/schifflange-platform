import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageForward } from "./forward.context.actions"
import { SWRForwards } from "./swr"

/**
 * types
 */
export type ForwardsContextType = Selectable<Api.Forward> & {
  contextId: string
  swr: SWRForwards
} & ManageForward

/**
 * contexts
 */
export const ForwardsContext = React.createContext<ForwardsContextType | null>(null)

/**
 * hooks
 */
export const useForwards = () => {
  const context = React.useContext(ForwardsContext)
  if (!context) throw new Error("useForwards must be used within a ForwardsProvider")
  return context
}
