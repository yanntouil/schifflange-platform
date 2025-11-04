import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useCouncilsService } from "./service.context"
import { SWRCouncils } from "./swr.councils"

/**
 * useDisplayCouncil
 * This hook is used to display a council. It will navigate to the new council after creation.
 * This hook is not dependent of the CouncilContextProvider.
 */
export const useDisplayCouncil = () => {
  const [displayCouncil, displayCouncilProps] = Ui.useQuickDialog<Api.Council>()
  return [displayCouncil, displayCouncilProps] as const
}

/**
 * useCreateCouncil
 * This hook is used to create a council. It will navigate to the new council after creation.
 * This hook is not dependent of the CouncilContextProvider.
 */
export const useCreateCouncil = (append?: (council: Api.Council) => void) => {
  const [createCouncil, createCouncilProps] = Ui.useQuickDialog<void, Api.Council>({
    mutate: async (council) => void append?.(council),
  })
  return [createCouncil, createCouncilProps] as const
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRCouncils) => {
  const [editCouncil, editCouncilProps] = Ui.useQuickDialog<Api.Council>({
    mutate: async (council) => void swr.update(council),
  })
  return [editCouncil, editCouncilProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRCouncils) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useCouncilsService()
  const [confirmDeleteCouncil, confirmDeleteCouncilProps] = Ui.useConfirm<Api.Council>({
    onAsyncConfirm: async (council) =>
      match(await service.id(council.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(council.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteCouncil, confirmDeleteCouncilProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRCouncils, selectable: Selectable<Api.Council>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useCouncilsService()
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
 * ManageCouncils type
 */
export type ManageCouncils = ReturnType<typeof useManageCouncils>[0]

/**
 * useManageCouncils
 */
export const useManageCouncils = (swr: SWRCouncils, selectable: Selectable<Api.Council>) => {
  const [displayCouncil, displayCouncilProps] = useDisplayCouncil()
  const [createCouncil, createCouncilProps] = useCreateCouncil(swr.append)
  const [editCouncil, editCouncilProps] = useEdit(swr)
  const [confirmDeleteCouncil, confirmDeleteCouncilProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageFn = {
    displayCouncil,
    createCouncil,
    editCouncil,
    confirmDeleteCouncil,
    confirmDeleteSelection,
  }
  const manageProps = {
    displayCouncilProps,
    createCouncilProps,
    editCouncilProps,
    confirmDeleteCouncilProps,
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
        title: "Delete council meeting",
        success: "Council meeting has been deleted",
        error: "Error while deleting council meeting",
        progress: "Deleting council meeting",
      },
      "delete-selection": {
        title: "Delete selected council meetings",
        success: "Council meetings have been deleted",
        error: "Error while deleting council meetings",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer la réunion du conseil communal",
        success: "La réunion du conseil communal a été supprimée",
        error: "Erreur lors de la suppression de la réunion du conseil communal",
        progress: "Suppression de la réunion du conseil communal en cours",
      },
      "delete-selection": {
        title: "Supprimer les réunions du conseil communal sélectionnées",
        success: "Les réunions du conseil communal ont été supprimées",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Gemeinderatssitzung löschen",
        success: "Gemeinderatssitzung wurde gelöscht",
        error: "Fehler beim Löschen der Gemeinderatssitzung",
        progress: "Gemeinderatssitzung wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Gemeinderatssitzungen löschen",
        success: "Gemeinderatssitzungen wurden gelöscht",
        error: "Fehler beim Löschen der Gemeinderatssitzungen",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
