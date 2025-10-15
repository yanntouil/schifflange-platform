import { type Api } from "@services/dashboard"

import { createContext, useContext } from "react"

/**
 * types
 */
export type LanguagesServiceContextType = {
  service: Api.LanguagesService
}

/**
 * contexts
 */
export const LanguagesServiceContext = createContext<LanguagesServiceContextType | null>(null)

/**
 * hooks
 */
export const useLanguagesService = () => {
  const context = useContext(LanguagesServiceContext)
  if (!context) {
    throw new Error("useLanguagesService must be used within a LanguagesServiceProvider")
  }
  return context
}
