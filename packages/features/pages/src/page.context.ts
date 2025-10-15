import React from "react"
import { ManagePage } from "./page.context.actions"
import { SWRSafePage } from "./swr"

/**
 * types
 */
export type PageContextType = {
  contextId: string
  swr: SWRSafePage
} & ManagePage

/**
 * contexts
 */
export const PageContext = React.createContext<PageContextType | null>(null)

/**
 * hooks
 */
export const usePage = () => {
  const context = React.useContext(PageContext)
  if (!context) throw new Error("usePage must be used within a PageProvider")
  return context
}
