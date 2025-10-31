import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageCategory } from "./categories.context.actions"
import { SWRCategories } from "./swr.categories"

/**
 * types
 */
export type CategoriesContextType = Selectable<Api.ArticleCategory> & {
  contextId: string
  swr: SWRCategories
} & ManageCategory

/**
 * contexts
 */
export const CategoriesContext = React.createContext<CategoriesContextType | null>(null)

/**
 * hooks
 */
export const useCategories = () => {
  const context = React.useContext(CategoriesContext)
  if (!context) throw new Error("useCategories must be used within a CategoriesProvider")
  return context
}
