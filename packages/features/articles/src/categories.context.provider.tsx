import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { CategoriesContext } from "./categories.context"
import { useManageCategory } from "./categories.context.actions"
import { CategoriesCreateDialog } from "./components/categories.create"
import { CategoriesEditDialog } from "./components/categories.edit"
import { SWRCategories } from "./swr.categories"

/**
 * CategoriesProvider
 */
type CategoriesProviderProps = {
  swr: SWRCategories
  children: React.ReactNode
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.ArticleCategory>()

  useKeepOnly(swr.categories, selectable.keepOnly)

  const [manageCategory, manageCategoryProps] = useManageCategory(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageCategory,
      swr,
    }),
    [contextProps, manageCategory, swr]
  )
  return (
    <CategoriesContext.Provider key={contextId} value={value}>
      {children}
      <ManageCategory {...manageCategoryProps} key={`${contextId}-manageCategory`} />
    </CategoriesContext.Provider>
  )
}

/**
 * ManageCategory
 */
export type ManageCategoryProps = ReturnType<typeof useManageCategory>[1]
const ManageCategory: React.FC<ManageCategoryProps> = ({
  createCategoryProps,
  editCategoryProps,
  confirmDeleteCategoryProps,
  confirmDeleteSelectionCategoryProps,
}) => {
  return (
    <>
      <CategoriesCreateDialog {...createCategoryProps} />
      <CategoriesEditDialog {...editCategoryProps} />
      <Ui.Confirm {...confirmDeleteCategoryProps} />
      <Ui.Confirm {...confirmDeleteSelectionCategoryProps} />
    </>
  )
}
