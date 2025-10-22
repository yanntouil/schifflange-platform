import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useDirectoryService } from "./service.context"
import { SWROrganisations } from "./swr.organisations"

/**
 * useDisplay
 */
export const useDisplay = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useDirectoryService()
  const displayOrganisation = React.useCallback(
    (organisation: Api.Organisation) => {
      navigate(routesTo.organizations.byId(organisation.id))
    },
    [navigate, routesTo.organizations]
  )
  return displayOrganisation
}

/**
 * useCreateOrganisation
 * This hook is used to create an organisation. It will navigate to the new organisation after creation.
 * This hook is not dependent of the OrganisationContextProvider.
 */
export const useCreateOrganisation = (swr?: SWROrganisations) => {
  const [createOrganisation, createOrganisationProps] = Ui.useQuickDialog<void, Api.Organisation>({
    mutate: async (organisation) => void swr?.append(organisation),
  })
  return [createOrganisation, createOrganisationProps] as const
  // const [, navigate] = useLocation()
  // const { service, routesTo, organisationType, organisationId } = useDirectoryService()
  // const createOrganisation = async () => {
  //   const response = await service.organisations.create({
  //     type: organisationType,
  //     parentOrganisationId: organisationId ?? null,
  //   })
  //   if (response.ok) {
  //     navigate(routesTo.organizations.byId(response.data.organisation.id))
  //   }
  // }
  // return createOrganisation
}

/**
 * useEdit
 */
export const useEdit = (swr: SWROrganisations) => {
  const [editOrganisation, editOrganisationProps] = Ui.useQuickDialog<Api.Organisation>({
    mutate: async (organisation) => void swr.update(organisation),
  })
  return [editOrganisation, editOrganisationProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWROrganisations) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const [confirmDeleteOrganisation, confirmDeleteOrganisationProps] = Ui.useConfirm<Api.Organisation>({
    onAsyncConfirm: async (organisation) =>
      match(await service.organisations.id(organisation.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(organisation.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteOrganisation, confirmDeleteOrganisationProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWROrganisations, selectable: Selectable<Api.Organisation>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.organisations.id(id).delete())
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
 * ManageOrganisations type
 */
export type ManageOrganisations = ReturnType<typeof useManageOrganisations>[0]

/**
 * useManageOrganisations
 */
export const useManageOrganisations = (swr: SWROrganisations, selectable: Selectable<Api.Organisation>) => {
  const displayOrganisation = useDisplay()
  const [createOrganisation, createOrganisationProps] = useCreateOrganisation(swr)
  const [editOrganisation, editOrganisationProps] = useEdit(swr)
  const [confirmDeleteOrganisation, confirmDeleteOrganisationProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageFn = {
    displayOrganisation,
    createOrganisation,
    editOrganisation,
    confirmDeleteOrganisation,
    confirmDeleteSelection,
  }
  const manageProps = {
    createOrganisationProps,
    editOrganisationProps,
    confirmDeleteOrganisationProps,
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
        title: "Delete organisation",
        success: "Organisation has been deleted",
        error: "Error while deleting organisation",
        progress: "Deleting organisation",
      },
      "delete-selection": {
        title: "Delete selected organisations",
        success: "Organisations have been deleted",
        error: "Error while deleting organisations",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'organisation",
        success: "L'organisation a été supprimée",
        error: "Erreur lors de la suppression de l'organisation",
        progress: "Suppression de l'organisation en cours",
      },
      "delete-selection": {
        title: "Supprimer les organisations sélectionnées",
        success: "Les organisations ont été supprimées",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Organisation löschen",
        success: "Organisation wurde gelöscht",
        error: "Fehler beim Löschen der Organisation",
        progress: "Organisation wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Organisationen löschen",
        success: "Organisationen wurden gelöscht",
        error: "Fehler beim Löschen der Organisationen",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
