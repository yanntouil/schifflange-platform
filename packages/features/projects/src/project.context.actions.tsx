import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useProjectsService } from "./service.context"
import { SWRSafeProject } from "./swr"

/**
 * useDisplayStats
 */
export const useDisplayStats = () => {
  const [displayStats, displayStatsProps] = Ui.useQuickDialog<void>()
  return [displayStats, displayStatsProps] as const
}

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWRSafeProject) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => void swr.mutateProject({ slug }),
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useUpdateTag
 * This hook is used to update the tag of a project.
 */
export const useUpdateTag = (swr: SWRSafeProject) => {
  const { service } = useProjectsService()
  const updateTag = React.useCallback(
    async (tagId: string | null) => {
      match(await service.id(swr.projectId).update({ tagId }))
        .with({ ok: true }, ({ data }) => swr.mutateProject(data.project))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return updateTag
}

/**
 * useUpdateLocation
 * This hook is used to update the location of a project.
 */
export const useUpdateLocation = (swr: SWRSafeProject) => {
  const { service } = useProjectsService()
  const updateLocation = React.useCallback(
    async (location: string) => {
      match(await service.id(swr.projectId).update({ location }))
        .with({ ok: true }, ({ data }) => swr.mutateProject(data.project))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return updateLocation
}

/**
 * useUpdateCategory
 * This hook is used to update the category of a project.
 */
export const useUpdateCategory = (swr: SWRSafeProject) => {
  const { service } = useProjectsService()
  const updateCategory = React.useCallback(
    async (categoryId: string | null) => {
      match(await service.id(swr.projectId).update({ categoryId }))
        .with({ ok: true }, ({ data }) => swr.mutateProject(data.project))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return updateCategory
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRSafeProject) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const toggleStateProject = React.useCallback(async () => {
    match(await service.id(swr.projectId).update({ state: swr.project.state === "draft" ? "published" : "draft" }))
      .with({ ok: true }, ({ data }) => swr.mutateProject(data.project))
      .otherwise(() => {
        // do nothing atm
      })
  }, [service, swr])
  return toggleStateProject
}

/**
 * useToggleStepState
 * This hook is used to toggle the state between draft and published of a step.
 */
export const useToggleStepState = (swr: SWRSafeProject) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const toggleStepState = React.useCallback(
    async (stepId: string) => {
      const step = A.find(swr.project.steps, (step) => step.id === stepId)
      if (!step) return
      match(
        await service
          .id(swr.projectId)
          .steps.id(stepId)
          .update({ state: step.state === "draft" ? "published" : "draft" })
      )
        .with({ ok: true }, ({ data }) =>
          swr.mutateProject({
            ...swr.project,
            steps: A.map(swr.project.steps, (step) => (step.id === stepId ? data.step : step)),
          })
        )
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return toggleStepState
}

/**
 * useAddStep
 * This hook is used to add a step to a project.
 */
export const useAddStep = (swr: SWRSafeProject) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const addStep = React.useCallback(
    async (type: Api.ProjectStepType) => {
      match(await service.id(swr.projectId).steps.create({ type }))
        .with({ ok: true }, ({ data }) =>
          swr.mutateProject({
            ...swr.project,
            steps: A.sortBy(A.append(swr.project.steps, data.step), (step) => step.type),
          })
        )
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return addStep
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRSafeProject) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routeToProjects } = useProjectsService()
  const [confirmDeleteProject, confirmDeleteProjectProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.projectId).delete())
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
 * useConfirmDeleteStep
 */
export const useConfirmDeleteStep = (swr: SWRSafeProject) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const [confirmDeleteStep, confirmDeleteStepProps] = Ui.useConfirm<string>({
    onAsyncConfirm: async (stepId: string) =>
      match(await service.id(swr.projectId).steps.id(stepId).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.mutateProject({
            ...swr.project,
            steps: A.filter(swr.project.steps, (step) => step.id !== stepId),
          })
          return false
        }),
    t: _.prefixed("confirm.delete-step"),
  })
  return [confirmDeleteStep, confirmDeleteStepProps] as const
}

/**
 * ManageProject type
 */
export type ManageProject = ReturnType<typeof useManageProject>[0]

/**
 * useManageProject
 */
export const useManageProject = (swr: SWRSafeProject, trackingService: Api.TrackingService) => {
  const [displayStats, displayStatsProps] = useDisplayStats()
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const updateCategory = useUpdateCategory(swr)
  const updateTag = useUpdateTag(swr)
  const updateLocation = useUpdateLocation(swr)
  const toggleState = useToggleState(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDelete(swr)

  const addStep = useAddStep(swr)
  const toggleStepState = useToggleStepState(swr)
  const [confirmDeleteStep, confirmDeleteStepProps] = useConfirmDeleteStep(swr)

  const manageProject = {
    displayStats,
    editSlug,
    updateCategory,
    updateTag,
    updateLocation,
    toggleState,
    confirmDelete,
    addStep,
    toggleStepState,
    confirmDeleteStep,
  }

  const manageProjectProps = {
    trackingService,
    displayStatsProps,
    editSlugProps,
    confirmDeleteProps,
    confirmDeleteStepProps,
  }

  return [manageProject, manageProjectProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete project",
        description:
          "This action cannot be undone. This will permanently delete the project and all its associated content, SEO settings, and analytics data.",
        success: "Project has been deleted",
        error: "Error while deleting project",
        progress: "Deleting project",
      },
      "delete-step": {
        title: "Delete step",
        description:
          "This action cannot be undone. The step will be permanently deleted along with all its content, SEO settings, and analytics data.",
        success: "Step has been deleted",
        error: "Error while deleting step",
        progress: "Deleting step",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer le projet",
        description:
          "Cette action est irréversible. Le projet sera définitivement supprimé ainsi que tout son contenu, ses paramètres SEO et ses données analytiques.",
        success: "Le projet a été supprimé",
        error: "Erreur lors de la suppression du projet",
        progress: "Suppression du projet en cours",
      },
      "delete-step": {
        title: "Supprimer l'étape",
        description:
          "Cette action est irréversible. L'étape  sera définitivement supprimé ainsi que tout son contenu, ses paramètres SEO et ses données analytiques.",
        success: "L'étape a été supprimé",
        error: "Erreur lors de la suppression de l'étape",
        progress: "Suppression de l'étape en cours",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Projekt löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Das Projekt wird dauerhaft gelöscht, einschließlich aller zugehörigen Inhalte, SEO-Einstellungen und Analysedaten.",
        success: "Projekt wurde gelöscht",
        error: "Fehler beim Löschen des Projekts",
        progress: "Projekt wird gelöscht",
      },
      "delete-step": {
        title: "Schritt löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Der Schritt wird dauerhaft gelöscht, einschließlich aller zugehörigen Inhalte, SEO-Einstellungen und Analysedaten.",
        success: "Schritt wurde gelöscht",
        error: "Fehler beim Löschen des Schritts",
        progress: "Schritt wird gelöscht",
      },
    },
  },
}
