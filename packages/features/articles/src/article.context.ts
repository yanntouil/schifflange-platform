import React from "react"
import { ManageArticle } from "./article.context.actions"
import { SWRSafeArticle } from "./swr.article"

/**
 * types
 */
export type ArticleContextType = {
  contextId: string
  swr: SWRSafeArticle
} & ManageArticle

/**
 * contexts
 */
export const ArticleContext = React.createContext<ArticleContextType | null>(null)

/**
 * hooks
 */
export const useArticle = () => {
  const context = React.useContext(ArticleContext)
  if (!context) throw new Error("useArticle must be used within a ArticleProvider")
  return context
}
