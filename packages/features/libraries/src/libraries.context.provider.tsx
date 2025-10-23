import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { LibrariesCreateDialog } from "./components/libraries.create"
import { LibrariesEditDialog } from "./components/libraries.edit"
import { LibrariesContext } from "./libraries.context"
import { useManageLibraries } from "./libraries.context.actions"
import { SWRLibraries } from "./swr.libraries"

/**
 * LibrariesProvider
 */
type LibrariesProviderProps = {
  swr: SWRLibraries
  children: React.ReactNode
}

export const LibrariesProvider: React.FC<LibrariesProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.Library>()

  useKeepOnly(swr.libraries, selectable.keepOnly)

  const [manageLibraries, manageLibrariesProps] = useManageLibraries(swr, selectable)

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
      ...manageLibraries,
      swr,
    }),
    [contextProps, manageLibraries, swr]
  )

  return (
    <LibrariesContext.Provider key={contextId} value={value}>
      {children}
      <ManageLibraries {...manageLibrariesProps} key={`${contextId}-manageLibraries`} />
    </LibrariesContext.Provider>
  )
}

/**
 * ManageLibraries
 */
export type ManageLibrariesProps = ReturnType<typeof useManageLibraries>[1]
const ManageLibraries: React.FC<ManageLibrariesProps> = ({
  createLibraryProps,
  editLibraryProps,
  confirmDeleteLibraryProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <LibrariesCreateDialog {...createLibraryProps} />
      <LibrariesEditDialog {...editLibraryProps} />
      <Ui.Confirm {...confirmDeleteLibraryProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
