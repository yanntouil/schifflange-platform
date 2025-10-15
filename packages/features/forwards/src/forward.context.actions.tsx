import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useForwardsService } from "./service.context"
import { SWRForwards } from "./swr"

/**
 * useCreateForward
 */
export const useCreateForward = (swr: SWRForwards) => {
  const [createForward, createForwardProps] = Ui.useQuickDialog<void, Api.Forward>({
    mutate: async (forward) => void swr.mutateForward(forward),
  })
  return [createForward, createForwardProps] as const
}

/**
 * useEditForward
 */
export const useEditForward = (swr: SWRForwards) => {
  const [editForward, editForwardProps] = Ui.useQuickDialog<Api.Forward>({
    mutate: async (forward) => void swr.mutateForward(forward),
  })
  return [editForward, editForwardProps] as const
}

/**
 * useConfirmDeleteForward
 */
export const useConfirmDeleteForward = (swr: SWRForwards) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useForwardsService()
  const [confirmDeleteForward, confirmDeleteForwardProps] = Ui.useConfirm<Api.Forward>({
    onAsyncConfirm: async (forward) =>
      match(await service.id(forward.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectForward(forward)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteForward, confirmDeleteForwardProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRForwards, selectable: Selectable<Api.Forward>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useForwardsService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectForwardById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * ManageForward type
 */
export type ManageForward = ReturnType<typeof useManageForward>[0]

/**
 * useManagePage
 */
export const useManageForward = (swr: SWRForwards, selectable: Selectable<Api.Forward>) => {
  const [createForward, createForwardProps] = useCreateForward(swr)
  const [editForward, editForwardProps] = useEditForward(swr)
  const [confirmDeleteForward, confirmDeleteForwardProps] = useConfirmDeleteForward(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const managePage = {
    createForward,
    editForward,
    confirmDeleteForward,
    confirmDeleteSelection,
  }

  const managePageProps = {
    createForwardProps,
    editForwardProps,
    confirmDeleteForwardProps,
    confirmDeleteSelectionProps,
  }

  return [managePage, managePageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete redirect",
        success: "Redirect has been deleted",
        error: "Error while deleting redirect",
        progress: "Deleting redirect",
      },
      "delete-selection": {
        title: "Delete selected redirects",
        success: "Redirects have been deleted",
        error: "Error while deleting redirects",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer la redirection",
        success: "La redirection a été supprimée",
        error: "Erreur lors de la suppression de la redirection",
        progress: "Suppression de la redirection en cours",
      },
      "delete-selection": {
        title: "Supprimer les redirections sélectionnées",
        success: "Les redirections ont été supprimées",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Weiterleitung löschen",
        success: "Die Weiterleitung wurde gelöscht",
        error: "Fehler beim Löschen der Weiterleitung",
        progress: "Weiterleitung wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Weiterleitungen löschen",
        success: "Die Weiterleitungen wurden gelöscht",
        error: "Fehler beim Löschen",
        progress: "{{counter}} / {{total}} werden gelöscht",
      },
    },
  },
}
