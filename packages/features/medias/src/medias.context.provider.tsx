import { useKeepOnly, useSelectable } from "@compo/hooks"
import { LightboxProvider } from "@compo/lightbox"
import { Ui } from "@compo/ui"
import { D } from "@compo/utils"
import { useDashboardService, type Api } from "@services/dashboard"
import React from "react"
import { CreateFolderDialog } from "./components/dialogs/create-folder"
import { CropFileDialog } from "./components/dialogs/crop-file"
import { EditFileDialog } from "./components/dialogs/edit-file"
import { EditFolderDialog } from "./components/dialogs/edit-folder"
import { FileInfoDialog } from "./components/dialogs/file-info"
import { MoveFileDialog } from "./components/dialogs/move-file"
import { MoveFolderDialog } from "./components/dialogs/move-folder"
import { MoveSelectionDialog } from "./components/dialogs/move-selection"
import { UploadFilesDialog } from "./components/dialogs/upload-files"
import { MediasContext } from "./medias.context"
import { useManageFile, useManageFolder, useManageSelection } from "./medias.context.actions"
import { SWRMedias } from "./swr"

/**
 * MediasProvider
 */
type MediasProviderProps = {
  swr: SWRMedias
  canSelectFolder?: boolean
  canSelectFile?: boolean
  multiple?: boolean
  onSelect?: (selected: Api.MediaWithRelations[]) => void
  children: React.ReactNode
}
export const MediasProvider: React.FC<MediasProviderProps> = ({
  swr,
  canSelectFolder = false,
  canSelectFile = false,
  multiple = false,
  onSelect,
  children,
}) => {
  const contextId = React.useId()

  const folder = React.useMemo(() => D.get(swr.folderByIds, swr.folderId ?? ""), [swr.folderId, swr.folderByIds])

  // selectable
  const selectable = useSelectable<Api.MediaWithRelations>({
    multiple,
    onSelect,
  })
  const merged = React.useMemo(() => [...swr.folders, ...swr.files], [swr.folders, swr.files])
  useKeepOnly(merged, selectable.keepOnly)

  const [manageFolder, manageFolderProps] = useManageFolder(swr)
  const [manageFile, manageFileProps] = useManageFile(swr)
  const [manageSelection, manageSelectionProps] = useManageSelection(swr, selectable)
  const contextProps = React.useMemo(
    () => ({
      // context service adn data
      contextId,
      swr,
      folder,
      // selectable
      canSelectFolder,
      canSelectFile,
      ...selectable,
    }),
    [canSelectFolder, canSelectFile, selectable, contextId, swr, folder]
  )
  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageFolder,
      ...manageFile,
      ...manageSelection,
    }),
    [contextProps, manageFolder, manageFile, manageSelection]
  )

  const {
    service: { makePath },
  } = useDashboardService()
  return (
    <LightboxProvider makeUrl={(path) => makePath(path, true)}>
      <MediasContext.Provider key={contextId} value={value}>
        {children}
        <ManageFolder {...manageFolderProps} key={`${contextId}-manageFolder`} />
        <ManageFile {...manageFileProps} key={`${contextId}-manageFile`} />
        <ManageSelection {...manageSelectionProps} key={`${contextId}-manageSelection`} />
      </MediasContext.Provider>
    </LightboxProvider>
  )
}

/**
 * ManageFolder
 */
export type ManageFolderProps = ReturnType<typeof useManageFolder>[1]
const ManageFolder: React.FC<ManageFolderProps> = ({
  editFolderProps,
  moveFolderProps,
  confirmDeleteFolderProps,
  createFolderProps,
}) => {
  return (
    <>
      <EditFolderDialog {...editFolderProps} />
      <MoveFolderDialog {...moveFolderProps} />
      <Ui.Confirm {...confirmDeleteFolderProps} />
      <CreateFolderDialog {...createFolderProps} />
    </>
  )
}

/**
 * ManageFile
 */
export type ManageFileProps = ReturnType<typeof useManageFile>[1]
const ManageFile: React.FC<ManageFileProps> = ({
  editFileProps,
  moveFileProps,
  fileInfoProps,
  cropFileProps,
  confirmDeleteFileProps,
  uploadFilesProps,
}) => {
  return (
    <>
      <EditFileDialog {...editFileProps} />
      <CropFileDialog {...cropFileProps} />
      <MoveFileDialog {...moveFileProps} />
      <FileInfoDialog {...fileInfoProps} />
      <Ui.Confirm {...confirmDeleteFileProps} />
      <UploadFilesDialog {...uploadFilesProps} />
    </>
  )
}

/**
 * useManageSelection
 */
export type ManageSelectionProps = ReturnType<typeof useManageSelection>[1]
const ManageSelection: React.FC<ManageSelectionProps> = ({ moveSelectionProps, confirmDeleteSelectionProps }) => {
  return (
    <>
      <MoveSelectionDialog {...moveSelectionProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
