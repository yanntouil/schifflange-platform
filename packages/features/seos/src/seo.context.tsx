import { type Api } from "@services/dashboard"
import React from "react"

/**
 * types
 */
export type SeoContextType = {
  contextId: string
  persistedId: string
  service: Api.SeoService
  seo: Api.Seo
  mutate: (seo: Api.Seo) => void
  makePath: Api.Service["makePath"]
  getImageUrl: Api.Service["getImageUrl"]
  edit: () => void
}

/**
 * contexts
 */
export const SeoContext = React.createContext<SeoContextType | null>(null)

/**
 * hooks
 */
export const useSeo = () => {
  const context = React.useContext(SeoContext)
  if (!context) throw new Error("useSeo must be used within a SeoProvider")
  return context
}
