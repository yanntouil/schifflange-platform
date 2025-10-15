import { type Api } from "@services/dashboard"
import React from "react"

/**
 * types
 */
export type PublicationContextType = {
  contextId: string
  persistedId: string
  service: Api.PublicationService
  publication: Api.Publication
  mutate: (publication: Api.Publication) => void
  getImageUrl: Api.GetImageUrl
  publishedUsers: Api.User[]
  edit: () => void
}

/**
 * contexts
 */
export const PublicationContext = React.createContext<PublicationContextType | null>(null)

/**
 * hooks
 */
export const usePublication = () => {
  const context = React.useContext(PublicationContext)
  if (!context) throw new Error("usePublication must be used within a PublicationProvider")
  return context
}
