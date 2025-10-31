import { useKeepOnly, useSelectable } from "@compo/hooks"
import { EditSlugDialog } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { ArticlesContext } from "./articles.context"
import { useManageArticle } from "./articles.context.actions"
import { ArticlesCreateDialog } from "./components/articles.create"
import { ArticlesEditDialog } from "./components/articles.edit"
import { SWRArticles } from "./swr.articles"

/**
 * ArticlesProvider
 */
type ArticlesProviderProps = {
  swr: SWRArticles
  canSelectArticle?: boolean
  multiple?: boolean
  onSelect?: (selected: Api.ArticleWithRelations[]) => void
  children: React.ReactNode
}

export const ArticlesProvider: React.FC<ArticlesProviderProps> = ({
  swr,
  canSelectArticle = false,
  multiple = false,
  onSelect,
  children,
}) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.ArticleWithRelations>({
    multiple,
    onSelect,
  })

  useKeepOnly(swr.articles, selectable.keepOnly)

  const [manageArticle, manageArticleProps] = useManageArticle(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      // selectable
      canSelectArticle,
      ...selectable,
    }),
    [canSelectArticle, selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageArticle,
      swr,
    }),
    [contextProps, manageArticle, swr]
  )
  return (
    <ArticlesContext.Provider key={contextId} value={value}>
      {children}
      <ManageArticle {...manageArticleProps} key={`${contextId}-manageArticle`} />
    </ArticlesContext.Provider>
  )
}

/**
 * ManageArticle
 */
export type ManageArticleProps = ReturnType<typeof useManageArticle>[1]
const ManageArticle: React.FC<ManageArticleProps> = ({
  createArticleProps,
  editArticleProps,
  editSlugProps,
  confirmDeleteArticleProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <ArticlesEditDialog {...editArticleProps} />
      <EditSlugDialog {...editSlugProps} />
      <ArticlesCreateDialog {...createArticleProps} />
      <Ui.Confirm {...confirmDeleteArticleProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
