import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useLibrariesService } from "./service.context"
import { SWRLibraries } from "./swr.libraries"

/**
 * useDisplay
 */
export const useDisplay = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useLibrariesService()
  const displayLibrary = React.useCallback(
    (library: Api.Library) => {
      navigate(routesTo.byId(library.id))
    },
    [navigate, routesTo.byId]
  )
  return displayLibrary
}

/**
 * useCreateLibrary
 * This hook is used to create a library. It will navigate to the new library after creation.
 * This hook is not dependent of the LibraryContextProvider.
 */
export const useCreateLibrary = (swr?: SWRLibraries) => {
  const [createLibrary, createLibraryProps] = Ui.useQuickDialog<void, Api.Library>({
    mutate: async (library) => void swr?.append(library),
  })
  return [createLibrary, createLibraryProps] as const
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRLibraries) => {
  const [editLibrary, editLibraryProps] = Ui.useQuickDialog<Api.Library>({
    mutate: async (library) => void swr.update(library),
  })
  return [editLibrary, editLibraryProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRLibraries) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()
  const [confirmDeleteLibrary, confirmDeleteLibraryProps] = Ui.useConfirm<Api.Library>({
    onAsyncConfirm: async (library) =>
      match(await service.id(library.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(library.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteLibrary, confirmDeleteLibraryProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRLibraries, selectable: Selectable<Api.Library>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useLibrariesService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * ManageLibraries type
 */
export type ManageLibraries = ReturnType<typeof useManageLibraries>[0]

/**
 * useManageLibraries
 */
export const useManageLibraries = (swr: SWRLibraries, selectable: Selectable<Api.Library>) => {
  const displayLibrary = useDisplay()
  const [createLibrary, createLibraryProps] = useCreateLibrary(swr)
  const [editLibrary, editLibraryProps] = useEdit(swr)
  const [confirmDeleteLibrary, confirmDeleteLibraryProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageFn = {
    displayLibrary,
    createLibrary,
    editLibrary,
    confirmDeleteLibrary,
    confirmDeleteSelection,
  }
  const manageProps = {
    createLibraryProps,
    editLibraryProps,
    confirmDeleteLibraryProps,
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
      delete: {
        title: "Delete library",
        success: "Library has been deleted",
        error: "Error while deleting library",
        progress: "Deleting library",
      },
      "delete-selection": {
        title: "Delete selected libraries",
        success: "Libraries have been deleted",
        error: "Error while deleting libraries",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer la bibliothèque",
        success: "La bibliothèque a été supprimée",
        error: "Erreur lors de la suppression de la bibliothèque",
        progress: "Suppression de la bibliothèque en cours",
      },
      "delete-selection": {
        title: "Supprimer les bibliothèques sélectionnées",
        success: "Les bibliothèques ont été supprimées",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Bibliothek löschen",
        success: "Bibliothek wurde gelöscht",
        error: "Fehler beim Löschen der Bibliothek",
        progress: "Bibliothek wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Bibliotheken löschen",
        success: "Bibliotheken wurden gelöscht",
        error: "Fehler beim Löschen der Bibliotheken",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
