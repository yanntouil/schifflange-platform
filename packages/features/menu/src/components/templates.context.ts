import { useContextualLanguage } from "@compo/translations"
import { A, D } from "@compo/utils"
import { Api } from "@services/dashboard"
import React from "react"
import { makeSubItemValues } from "./menu/utils"

/**
 * types
 */
export type MenuTemplate = {
  label: string
  value: string
  content: React.ReactNode
  Render: React.FC<{
    item: Api.MenuItemWithRelations
  }>
}
export type TemplatesContextType = {
  templates: MenuTemplate[]
}

/**
 * constants
 */
const emptyTemplates: TemplatesContextType = { templates: [] }

/**
 * context
 */
export const TemplatesContext = React.createContext<TemplatesContextType>(emptyTemplates)

/**
 * hooks
 */
export const useTemplates = () => {
  const templates = React.useContext(TemplatesContext)
  if (!templates) return emptyTemplates
  return templates
}

/**
 * useTemplate
 * prepare values in an template
 */
export const useTemplate = (item: Api.MenuItemWithRelations) => {
  const { languages } = useContextualLanguage()
  const values = makeSubItemValues(item, languages)
  const translations = A.map(D.toPairs(values.translations), ([languageId, translation]) => ({
    languageId,
    ...translation,
  }))
  return {
    ...values,
    translations,
  }
}
