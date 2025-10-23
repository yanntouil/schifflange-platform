import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageLibrary } from "./library.context.actions"
import { SWRSafeLibrary } from "./swr.library"

/**
 * types
 */
export type LibraryContextType = Selectable<Api.LibraryDocument> & {
  contextId: string
  swr: SWRSafeLibrary
  publishedUsers: Api.User[]
} & ManageLibrary

/**
 * contexts
 */
export const LibraryContext = React.createContext<LibraryContextType | null>(null)

/**
 * hooks
 */
export const useLibrary = () => {
  const context = React.useContext(LibraryContext)
  if (!context) throw new Error("useLibrary must be used within a LibraryProvider")
  return context
}
