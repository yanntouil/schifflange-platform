import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManagePage } from "./pages.context.actions"
import { SWRPages } from "./swr.pages"

/**
 * types
 */
export type PagesContextType = Selectable<Api.PageWithRelations> & {
  contextId: string
  swr: SWRPages
} & ManagePage

/**
 * contexts
 */
export const PagesContext = React.createContext<PagesContextType | null>(null)

/**
 * hooks
 */
export const usePages = () => {
  const context = React.useContext(PagesContext)
  if (!context) throw new Error("usePages must be used within a PagesProvider")
  return context
}
