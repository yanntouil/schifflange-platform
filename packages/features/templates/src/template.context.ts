import React from "react"
import { SWRSafeTemplate } from "./swr"
import { ManageTemplate } from "./template.context.actions"

/**
 * types
 */
export type TemplateContextType = {
  contextId: string
  swr: SWRSafeTemplate
} & ManageTemplate

/**
 * contexts
 */
export const TemplateContext = React.createContext<TemplateContextType | null>(null)

/**
 * hooks
 */
export const useTemplate = () => {
  const context = React.useContext(TemplateContext)
  if (!context) throw new Error("useTemplate must be used within a TemplateProvider")
  return context
}
