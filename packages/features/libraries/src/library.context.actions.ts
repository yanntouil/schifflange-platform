import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useLocation } from "wouter"
import { useLibrariesService } from "./service.context"
import { useSwrLibraries } from "./swr.libraries"
import { SWRSafeLibrary } from "./swr.library"
import { usePinnedLibraries } from "./swr.pinned-library"

/**
 * useEditLibrary
 */
export const useEditLibrary = (swr: SWRSafeLibrary) => {
  const rootSwr = useSwrLibraries()
  const [editLibraryFn, editLibraryProps] = Ui.useQuickDialog<Api.Library>({
    mutate: async (library) => {
      // update the root libraries use in sidebar navigation
      if (library.parentLibraryId === null) rootSwr.update(library)
      swr.mutateLibrary(library)
    },
  })
  const editLibrary = () => editLibraryFn(swr.library)
  return [editLibrary, editLibraryProps] as const
}

/**
 * usePinned
 */
export const usePinned = () => {
  const { makePinnable } = usePinnedLibraries()
  return makePinnable
}

/**
 * useConfirmDeleteLibrary
 */
export const useConfirmDeleteLibrary = (swr: SWRSafeLibrary) => {
  const { _ } = useTranslation(dictionary)
  const rootSwr = useSwrLibraries()
  const { service, routesTo } = useLibrariesService()
  const [, navigate] = useLocation()
  const [confirmDeleteLibrary, confirmDeleteLibraryProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.libraryId).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routesTo.list())
          return false
        }),
    t: _.prefixed("confirm.delete-library"),
  })
  return [confirmDeleteLibrary, confirmDeleteLibraryProps] as const
}

/**
 * useCreateDocument
 */
export const useCreateDocument = (swr?: SWRSafeLibrary) => {
  const [createDocument, createDocumentProps] = Ui.useQuickDialog<void, Api.LibraryDocument>({
    mutate: async (libraryDocument) => void swr?.appendDocument(libraryDocument),
  })
  return [createDocument, createDocumentProps] as const
}

/**
 * useEditDocument
 */
export const useEditDocument = (swr: SWRSafeLibrary) => {
  const [editLibraryDocument, editLibraryDocumentProps] = Ui.useQuickDialog<Api.LibraryDocument>({
    mutate: async (libraryDocument) => void swr.updateDocument(libraryDocument),
  })
  return [editLibraryDocument, editLibraryDocumentProps] as const
}

/**
 * useConfirmDeleteDocument
 */
export const useConfirmDeleteDocument = (swr: SWRSafeLibrary) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()
  const [confirmDeleteLibraryDocument, confirmDeleteLibraryDocumentProps] = Ui.useConfirm<Api.LibraryDocument>({
    onAsyncConfirm: async (libraryDocument) =>
      match(await service.id(swr.libraryId).documents.id(libraryDocument.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectDocumentById(libraryDocument.id)
          return false
        }),
    t: _.prefixed("confirm.delete-document"),
  })
  return [confirmDeleteLibraryDocument, confirmDeleteLibraryDocumentProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRSafeLibrary, selectable: Selectable<Api.LibraryDocument>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(swr.libraryId).documents.id(id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectDocumentById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * ManageLibraryDocuments type
 */
export type ManageLibrary = ReturnType<typeof useManageLibrary>[0]

/**
 * useManageLibraryDocuments
 */
export const useManageLibrary = (swr: SWRSafeLibrary, selectable: Selectable<Api.LibraryDocument>) => {
  const [editLibrary, editLibraryProps] = useEditLibrary(swr)
  const makePinned = usePinned()
  const [confirmDeleteLibrary, confirmDeleteLibraryProps] = useConfirmDeleteLibrary(swr)
  const [createDocument, createDocumentProps] = useCreateDocument(swr)
  const [editLibraryDocument, editLibraryDocumentProps] = useEditDocument(swr)
  const [confirmDeleteLibraryDocument, confirmDeleteLibraryDocumentProps] = useConfirmDeleteDocument(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageFn = {
    editLibrary,
    makePinned,
    confirmDeleteLibrary,
    createDocument,
    editLibraryDocument,
    confirmDeleteLibraryDocument,
    confirmDeleteSelection,
  }
  const manageProps = {
    editLibraryProps,
    confirmDeleteLibraryProps,
    createDocumentProps,
    editLibraryDocumentProps,
    confirmDeleteLibraryDocumentProps,
    confirmDeleteSelectionProps,
  }
  return [manageFn, manageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      "delete-library": {
        title: "Delete library",
        description:
          "You are about to delete this library. This will permanently delete all documents and sub-libraries it contains. If you wish to continue, you will be redirected to the library list.",
        success: "Library has been deleted",
        error: "Error while deleting library",
        progress: "Deleting library",
      },
      "delete-document": {
        title: "Delete document",
        description: "You are about to permanently delete this document. This action cannot be undone.",
        success: "Document has been deleted",
        error: "Error while deleting document",
        progress: "Deleting document",
      },
      "delete-selection": {
        title: "Delete selected documents",
        description: "You are about to permanently delete the selected documents. This action cannot be undone.",
        success: "Documents have been deleted",
        error: "Error while deleting documents",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      "delete-library": {
        title: "Supprimer la bibliothèque",
        description:
          "Vous êtes sur le point de supprimer cette bibliothèque. Cela supprimera définitivement tous les documents et sous-bibliothèques qu'elle contient. Si vous souhaitez continuer, vous serez redirigé vers la liste des bibliothèques.",
        success: "La bibliothèque a été supprimée",
        error: "Erreur lors de la suppression de la bibliothèque",
        progress: "Suppression de la bibliothèque en cours",
      },
      "delete-document": {
        title: "Supprimer le document",
        description: "Vous êtes sur le point de supprimer définitivement ce document. Cette action est irréversible.",
        success: "Le document a été supprimé",
        error: "Erreur lors de la suppression du document",
        progress: "Suppression du document en cours",
      },
      "delete-selection": {
        title: "Supprimer les documents sélectionnés",
        description:
          "Vous êtes sur le point de supprimer définitivement les documents sélectionnés. Cette action est irréversible.",
        success: "Les documents ont été supprimés",
        error: "Erreur lors de la suppression des documents",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      "delete-library": {
        title: "Bibliothek löschen",
        description:
          "Sie sind dabei, diese Bibliothek zu löschen. Dies wird alle darin enthaltenen Dokumente und Unterbibliotheken unwiderruflich löschen. Wenn Sie fortfahren möchten, werden Sie zur Liste der Bibliotheken weitergeleitet.",
        success: "Bibliothek wurde gelöscht",
        error: "Fehler beim Löschen der Bibliothek",
        progress: "Bibliothek wird gelöscht",
      },
      "delete-document": {
        title: "Dokument löschen",
        description:
          "Sie sind dabei, dieses Dokument unwiderruflich zu löschen. Diese Aktion kann nicht rückgängig gemacht werden.",
        success: "Dokument wurde gelöscht",
        error: "Fehler beim Löschen des Dokuments",
        progress: "Dokument wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Dokumente löschen",
        description:
          "Sie sind dabei, die ausgewählten Dokumente unwiderruflich zu löschen. Diese Aktion kann nicht rückgängig gemacht werden.",
        success: "Dokumente wurden gelöscht",
        error: "Fehler beim Löschen der Dokumente",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
