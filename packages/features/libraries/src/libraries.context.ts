import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageLibraries } from "./libraries.context.actions"
import { SWRLibraries } from "./swr.libraries"

/**
 * types
 */
export type LibrariesContextType = Selectable<Api.Library> & {
  contextId: string
  swr: SWRLibraries
} & ManageLibraries

/**
 * contexts
 */
export const LibrariesContext = React.createContext<LibrariesContextType | null>(null)

/**
 * hooks
 */
export const useLibraries = () => {
  const context = React.useContext(LibrariesContext)
  if (!context) throw new Error("useLibraries must be used within a LibrariesProvider")
  return context
}
