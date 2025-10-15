import { ContentContextType } from "@compo/contents"
import { type Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type TemplatesService = Api.TemplatesService
export type TemplatesServiceContextType = {
  service: Api.TemplatesService
  serviceKey: string
  type: Api.TemplateType
  items: ContentContextType["items"]
  routeToTemplates: () => string
  routeToTemplate: (templateId: string) => string
}

/**
 * contexts
 */
export const TemplatesServiceContext = createContext<TemplatesServiceContextType | null>(null)

/**
 * hooks
 */
export const useTemplatesService = () => {
  const context = useContext(TemplatesServiceContext)
  if (!context) {
    throw new Error("useTemplatesService must be used within a TemplatesServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
