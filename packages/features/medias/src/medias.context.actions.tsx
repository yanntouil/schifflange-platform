import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMediasFolder } from "./folder.context"
import { useMediasService } from "./service.context"
import { SWRMedias } from "./swr"
import { isMediaFile } from "./utils"

/**
 * useDisplayFolder
 */
export const useDisplayFolder = () => {
  const { setFolderId } = useMediasFolder()
  const displayFolder = React.useCallback(
    (folder: Api.MediaFolderWithRelations) => setFolderId(folder.id),
    [setFolderId]
  )
  return displayFolder
}

/**
 * useEditFolder
 */
export const useEditFolder = (swr: SWRMedias) => {
  const [editFolder, editFolderProps] = Ui.useQuickDialog<Api.MediaFolderWithRelations>({
    mutate: async (folder) => swr.updateFolder(folder),
  })
  return [editFolder, editFolderProps] as const
}

/**
 * useMoveFolder
 */
export const useMoveFolder = (swr: SWRMedias) => {
  const [moveFolder, moveFolderProps] = Ui.useQuickDialog<Api.MediaFolderWithRelations>({
    mutate: async (folder) => swr.updateFolder(folder),
  })
  return [moveFolder, moveFolderProps] as const
}

/**
 * useConfirmDeleteFolder
 */
export const useConfirmDeleteFolder = (swr: SWRMedias) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMediasService()
  const [confirmDeleteFolder, confirmDeleteFolderProps] = Ui.useConfirm<Api.MediaFolderWithRelations>({
    onAsyncConfirm: async (folder) =>
      match(await service.folders.id(folder.id).delete())
        .with({ failed: true }, () => true)
        .otherwise(() => {
          swr.rejectFolder(folder)
          return false
        }),
    t: _.prefixed("confirm.delete-folder"),
  })
  return [confirmDeleteFolder, confirmDeleteFolderProps] as const
}

/**
 * useCreateFolder
 */
export const useCreateFolder = (swr: SWRMedias) => {
  const [createFolder, createFolderProps] = Ui.useQuickDialog<void, Api.MediaFolderWithRelations>({
    mutate: async (folder) => swr.appendFolder(folder),
  })
  return [createFolder, createFolderProps] as const
}

/**
 * useManageFolder
 */
export const useManageFolder = (swr: SWRMedias) => {
  const { _ } = useTranslation(dictionary)
  const displayFolder = useDisplayFolder()
  const [editFolder, editFolderProps] = useEditFolder(swr)
  const [moveFolder, moveFolderProps] = useMoveFolder(swr)
  const [confirmDeleteFolder, confirmDeleteFolderProps] = useConfirmDeleteFolder(swr)
  const [createFolder, createFolderProps] = useCreateFolder(swr)
  const props = React.useMemo(
    () => ({
      editFolderProps,
      moveFolderProps,
      confirmDeleteFolderProps,
      createFolderProps,
    }),
    [editFolderProps, moveFolderProps, confirmDeleteFolderProps, createFolderProps]
  )
  const actions = React.useMemo(
    () => ({
      editFolder,
      moveFolder,
      confirmDeleteFolder,
      createFolder,
      displayFolder,
    }),
    [editFolder, moveFolder, confirmDeleteFolder, createFolder, displayFolder]
  )
  return [actions, props] as const
}
export type ManageFolder = ReturnType<typeof useManageFolder>[0]

/**
 * useFileInfo
 */
export const useFileInfo = () => {
  const [fileInfo, fileInfoProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>()
  return [fileInfo, fileInfoProps] as const
}

/**
 * useEditFile
 */
export const useEditFile = (swr: SWRMedias) => {
  const [editFile, editFileProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>({
    mutate: async (file) => {
      swr.updateFile(file)
    },
  })
  return [editFile, editFileProps] as const
}

/**
 * useCropFile
 */
export const useCropFile = (swr: SWRMedias) => {
  const [cropFile, cropFileBaseProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>({
    mutate: async (file) => {
      swr.updateFile(file)
    },
  })
  const cropFileProps = React.useMemo(
    () => ({
      ...cropFileBaseProps,
      append: async (file: Api.MediaFileWithRelations) => swr.appendFile(file),
    }),
    [cropFileBaseProps, swr]
  )
  return [cropFile, cropFileProps] as const
}

/**
 * useCopyFile
 */
export const useCopyFile = (swr: SWRMedias) => {
  const { service } = useMediasService()
  const copyFile = async (file: Api.MediaFileWithRelations) => {
    const { error, data } = await service.files.id(file.id).copy()
    if (error) return { error: true }
    swr.appendFile(data.file)
    return { error: false }
  }
  return copyFile
}

/**
 * useMoveFile
 */
export const useMoveFile = (swr: SWRMedias) => {
  const [moveFile, moveFileProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>({
    mutate: async (file) => {
      if (file.folderId === swr.folderId) swr.updateFile(file)
      else swr.rejectFile(file)
    },
  })
  return [moveFile, moveFileProps] as const
}

/**
 * useConfirmDeleteFile
 */
export const useConfirmDeleteFile = (swr: SWRMedias) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMediasService()
  const [confirmDeleteFile, confirmDeleteFileProps] = Ui.useConfirm<Api.MediaFileWithRelations>({
    onAsyncConfirm: async (file) => {
      return match(await service.files.id(file.id).delete())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          swr.rejectFile(file)
          return false
        })
    },
    t: _.prefixed("confirm.delete-file"),
  })
  return [confirmDeleteFile, confirmDeleteFileProps] as const
}

/**
 * useUploadFiles
 */
export const useUploadFiles = (swr: SWRMedias) => {
  const [uploadFiles, uploadFilesProps] = Ui.useQuickDialog<void, Api.MediaFileWithRelations>({
    mutate: async (file) => swr.appendFile(file),
  })
  return [uploadFiles, uploadFilesProps] as const
}

/**
 * useManageFile
 */
export const useManageFile = (swr: SWRMedias) => {
  const [fileInfo, fileInfoProps] = useFileInfo()
  const [editFile, editFileProps] = useEditFile(swr)
  const [cropFile, cropFileProps] = useCropFile(swr)
  const copyFile = useCopyFile(swr)
  const [moveFile, moveFileProps] = useMoveFile(swr)
  const [confirmDeleteFile, confirmDeleteFileProps] = useConfirmDeleteFile(swr)
  const [uploadFiles, uploadFilesProps] = useUploadFiles(swr)
  const props = React.useMemo(
    () => ({
      fileInfoProps,
      editFileProps,
      cropFileProps,
      moveFileProps,
      confirmDeleteFileProps,
      uploadFilesProps,
    }),
    [fileInfoProps, editFileProps, cropFileProps, moveFileProps, confirmDeleteFileProps, uploadFilesProps]
  )
  const actions = React.useMemo(
    () => ({
      fileInfo,
      editFile,
      cropFile,
      copyFile,
      moveFile,
      confirmDeleteFile,
      uploadFiles,
    }),
    [fileInfo, editFile, cropFile, copyFile, moveFile, confirmDeleteFile, uploadFiles]
  )
  return [actions, props] as const
}
export type ManageFile = ReturnType<typeof useManageFile>[0]

/**
 * useMoveSelection
 */
export const useMoveSelection = (swr: SWRMedias, selectable: Selectable<Api.MediaWithRelations>) => {
  const [moveSelectionBase, moveSelectionProps] = Ui.useQuickDialog<Api.MediaWithRelations[], Api.MediaWithRelations>({
    mutate: async (item) => (isMediaFile(item) ? swr.updateFile(item) : swr.updateFolder(item)),
  })
  const moveSelection = React.useCallback(() => {
    moveSelectionBase(selectable.selected)
  }, [moveSelectionBase, selectable])
  return [moveSelection, moveSelectionProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRMedias, selectable: Selectable<Api.MediaWithRelations>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMediasService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, Api.MediaWithRelations>({
    onAsyncConfirm: async (item) => {
      return match(
        isMediaFile(item) ? await service.files.id(item.id).delete() : await service.folders.id(item.id).delete()
      )
        .with({ failed: true }, () => true)
        .otherwise(() => {
          if (isMediaFile(item)) swr.rejectFile(item)
          else swr.rejectFolder(item)
          return false
        })
    },
    finally: async () => selectable.clear(),
    list: selectable.selected,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * useManageSelection
 */
export const useManageSelection = (swr: SWRMedias, selectable: Selectable<Api.MediaWithRelations>) => {
  const [moveSelection, moveSelectionProps] = useMoveSelection(swr, selectable)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)
  const props = React.useMemo(
    () => ({
      moveSelectionProps,
      confirmDeleteSelectionProps,
    }),
    [moveSelectionProps, confirmDeleteSelectionProps]
  )
  const actions = React.useMemo(
    () => ({
      moveSelection,
      confirmDeleteSelection,
    }),
    [moveSelection, confirmDeleteSelection]
  )
  return [actions, props] as const
}
export type ManageSelection = ReturnType<typeof useManageSelection>[0]

/**
 * translations
 */
const dictionary = {
  fr: {
    confirm: {
      "delete-folder": {
        title: "Supprimer le dossier",
        description:
          "Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est définitive et supprimera également tous les fichiers et dossiers qu'il contient.",
        success: "Le dossier a été supprimé",
        error: "Erreur lors de la suppression du dossier",
        progress: "Suppression du dossier en cours",
      },
      "delete-file": {
        title: "Supprimer le fichier",
        description:
          "Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est définitive et ne peut pas être annulée.",
        success: "Le fichier a été supprimé",
        error: "Erreur lors de la suppression du fichier",
        progress: "Suppression du fichier en cours",
      },
      "delete-selection": {
        title: "Supprimer la sélection",
        description:
          "Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ? Cette action est définitive et ne peut pas être annulée.",
        success: "La sélection a été supprimée",
        error: "Erreur lors de la suppression de la sélection",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      "delete-folder": {
        title: "Ordner löschen",
        description:
          "Sind Sie sicher, dass Sie diesen Ordner löschen möchten? Diese Aktion ist endgültig und wird auch alle darin enthaltenen Dateien und Ordner löschen.",
        success: "Der Ordner wurde gelöscht",
        error: "Fehler beim Löschen des Ordners",
        progress: "Löschung des Ordners läuft",
      },
      "delete-file": {
        title: "Datei löschen",
        description:
          "Sind Sie sicher, dass Sie diese Datei löschen möchten? Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.",
        success: "Die Datei wurde gelöscht",
        error: "Fehler beim Löschen der Datei",
        progress: "Löschung der Datei läuft",
      },
      "delete-selection": {
        title: "Auswahl löschen",
        description:
          "Sind Sie sicher, dass Sie die ausgewählten Elemente löschen möchten? Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.",
        success: "Die Auswahl wurde gelöscht",
        error: "Fehler beim Löschen der Auswahl",
        progress: "Löschung von {{counter}} / {{total}}",
      },
    },
  },
  en: {
    confirm: {
      "delete-folder": {
        title: "Delete folder",
        description:
          "Are you sure you want to delete this folder? This action is permanent and will also delete all files and folders contained within.",
        success: "The folder has been deleted",
        error: "Error during deletion of the folder",
        progress: "Deletion of the folder in progress",
      },
      "delete-file": {
        title: "Delete file",
        description: "Are you sure you want to delete this file? This action is permanent and cannot be undone.",
        success: "The file has been deleted",
        error: "Error during deletion of the file",
        progress: "Deletion of the file in progress",
      },
      "delete-selection": {
        title: "Delete selection",
        description:
          "Are you sure you want to delete the selected items? This action is permanent and cannot be undone.",
        success: "The selection has been deleted",
        error: "Error during deletion of the selection",
        progress: "Deletion of the selection in progress",
      },
    },
  },
}
