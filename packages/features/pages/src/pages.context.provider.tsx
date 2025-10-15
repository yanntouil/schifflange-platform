import { useKeepOnly, useSelectable } from "@compo/hooks"
import { EditSlugDialog } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { EditPageDialog } from "./components/dialogs"
import { PagesContext } from "./pages.context"
import { useManagePage } from "./pages.context.actions"
import { SWRPages } from "./swr"

/**
 * PagesProvider
 */
type PagesProviderProps = {
  swr: SWRPages
  canSelectPage?: boolean
  multiple?: boolean
  onSelect?: (selected: Api.PageWithRelations[]) => void
  children: React.ReactNode
}

export const PagesProvider: React.FC<PagesProviderProps> = ({
  swr,
  canSelectPage = false,
  multiple = false,
  onSelect,
  children,
}) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.PageWithRelations>({
    multiple,
    onSelect,
  })

  useKeepOnly(swr.pages, selectable.keepOnly)

  const [managePage, managePageProps] = useManagePage(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      // selectable
      canSelectPage,
      ...selectable,
    }),
    [canSelectPage, selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...managePage,
      swr,
    }),
    [contextProps, managePage, swr]
  )
  return (
    <PagesContext.Provider key={contextId} value={value}>
      {children}
      <ManagePage {...managePageProps} key={`${contextId}-managePage`} />
    </PagesContext.Provider>
  )
}

/**
 * ManagePage
 */
export type ManagePageProps = ReturnType<typeof useManagePage>[1]
const ManagePage: React.FC<ManagePageProps> = ({
  createPageProps,
  editPageProps,
  editSlugProps,
  confirmDeletePageProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <EditPageDialog {...editPageProps} />
      <EditSlugDialog {...editSlugProps} />
      <Ui.Confirm {...createPageProps} />
      <Ui.Confirm {...confirmDeletePageProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
