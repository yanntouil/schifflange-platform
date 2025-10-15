import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageArticle } from "./articles.context.actions"
import { SWRArticles } from "./swr"

/**
 * types
 */
export type ArticlesContextType = Selectable<Api.ArticleWithRelations> & {
  contextId: string
  swr: SWRArticles
} & ManageArticle

/**
 * contexts
 */
export const ArticlesContext = React.createContext<ArticlesContextType | null>(null)

/**
 * hooks
 */
export const useArticles = () => {
  const context = React.useContext(ArticlesContext)
  if (!context) throw new Error("useArticles must be used within a ArticlesProvider")
  return context
}
