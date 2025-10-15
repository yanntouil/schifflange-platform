import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { SWRTemplates } from "./swr"
import { ManageTemplate } from "./templates.context.actions"

/**
 * types
 */
export type TemplatesContextType = Selectable<Api.TemplateWithRelations> & {
  contextId: string
  swr: SWRTemplates
} & ManageTemplate

/**
 * contexts
 */
export const TemplatesContext = React.createContext<TemplatesContextType | null>(null)

/**
 * hooks
 */
export const useTemplates = () => {
  const context = React.useContext(TemplatesContext)
  if (!context) throw new Error("useTemplates must be used within a TemplatesProvider")
  return context
}
