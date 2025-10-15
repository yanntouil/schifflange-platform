import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useProjectsService } from "./service.context"
import { SWRSafeProjectStep } from "./swr"

/**
 * useDisplayStats
 */
export const useDisplayStats = () => {
  const [displayStats, displayStatsProps] = Ui.useQuickDialog<void>()
  return [displayStats, displayStatsProps] as const
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRSafeProjectStep) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const toggleStateProject = React.useCallback(async () => {
    match(
      await service
        .id(swr.projectId)
        .steps.id(swr.step.id)
        .update({ state: swr.step.state === "draft" ? "published" : "draft" })
    )
      .with({ ok: true }, ({ data }) => swr.mutateStep(data.step))
      .otherwise(() => {
        // do nothing atm
      })
  }, [service, swr])
  return toggleStateProject
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRSafeProjectStep) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routeToProjects } = useProjectsService()
  const [confirmDeleteProject, confirmDeleteProjectProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.projectId).steps.id(swr.step.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routeToProjects())
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteProject, confirmDeleteProjectProps] as const
}

/**
 * ManageStep type
 */
export type ManageStep = ReturnType<typeof useManageStep>[0]

/**
 * useManageStep
 */
export const useManageStep = (swr: SWRSafeProjectStep, trackingService: Api.TrackingService) => {
  const [displayStats, displayStatsProps] = useDisplayStats()
  const toggleState = useToggleState(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDelete(swr)

  const manageStep = {
    displayStats,
    toggleState,
    confirmDelete,
  }

  const manageStepProps = {
    trackingService,
    displayStatsProps,
    confirmDeleteProps,
  }

  return [manageStep, manageStepProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete project step",
        description:
          "This action cannot be undone. This will permanently delete the project step and all its associated content, SEO settings, and analytics data.",
        success: "Project step has been deleted",
        error: "Error while deleting project step",
        progress: "Deleting project step",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'étape du projet",
        description:
          "Cette action est irréversible. L'étape du projet sera définitivement supprimée ainsi que tout son contenu, ses paramètres SEO et ses données analytiques.",
        success: "L'étape du projet a été supprimée",
        error: "Erreur lors de la suppression de l'étape du projet",
        progress: "Suppression de l'étape du projet en cours",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Projekt-Schritt löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Der Projekt-Schritt wird dauerhaft gelöscht, einschließlich aller zugehörigen Inhalte, SEO-Einstellungen und Analysedaten.",
        success: "Projekt-Schritt wurde gelöscht",
        error: "Fehler beim Löschen des Projekt-Schritts",
        progress: "Projekt wird gelöscht",
      },
    },
  },
}
