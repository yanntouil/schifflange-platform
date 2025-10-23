import { useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { LibrariesEditDialog } from "./components/libraries.edit"
import { LibraryDocumentsCreateDialog } from "./components/library.documents.create"
import { LibraryDocumentsEditDialog } from "./components/library.documents.edit"
import { LibrariesProvider } from "./libraries.context.provider"
import { LibraryContext } from "./library.context"
import { useManageLibrary } from "./library.context.actions"
import { useLibrariesService } from "./service.context"
import { LibrariesServiceProvider } from "./service.context.provider"
import { SWRSafeLibrary } from "./swr.library"

/**
 * LibraryProvider
 */
type LibraryProviderProps = {
  swr: SWRSafeLibrary
  children: React.ReactNode
  publishedUsers: Api.User[]
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ swr, children, publishedUsers }) => {
  const contextId = React.useId()

  const service = useLibrariesService()

  // selectable
  const selectable = useSelectable<Api.LibraryDocument>()
  // useKeepOnly(swr.library.documents, selectable.keepOnly)

  const [manageLibrary, manageLibraryProps] = useManageLibrary(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      contextId,
      swr,
      publishedUsers,
    }),
    [contextId, swr, publishedUsers]
  )

  const value = React.useMemo(
    () => ({
      ...selectable,
      ...contextProps,
      ...manageLibrary,
    }),
    [contextProps, manageLibrary]
  )

  return (
    <LibraryContext.Provider key={contextId} value={value}>
      <LibrariesServiceProvider {...service} libraryId={swr.library.id}>
        <LibrariesProvider swr={swr.swrChildLibraries}>{children}</LibrariesProvider>
        <ManageLibrary {...manageLibraryProps} key={`${contextId}-manageLibrary`} />
      </LibrariesServiceProvider>
    </LibraryContext.Provider>
  )
}

/**
 * ManageLibrary
 */
export type ManageLibraryProps = ReturnType<typeof useManageLibrary>[1]
const ManageLibrary: React.FC<ManageLibraryProps> = ({
  editLibraryProps,
  confirmDeleteLibraryProps,
  createDocumentProps,
  editLibraryDocumentProps,
  confirmDeleteLibraryDocumentProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <LibrariesEditDialog {...editLibraryProps} />
      <Ui.Confirm {...confirmDeleteLibraryProps} />
      <LibraryDocumentsCreateDialog {...createDocumentProps} />
      <LibraryDocumentsEditDialog {...editLibraryDocumentProps} />
      <Ui.Confirm {...confirmDeleteLibraryDocumentProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
