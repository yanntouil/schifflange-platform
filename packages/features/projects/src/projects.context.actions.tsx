import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useProjectsService } from "./service.context"
import { SWRProjects } from "./swr"

/**
 * useDisplay
 */
export const useDisplay = () => {
  const [, navigate] = useLocation()
  const { routeToProject } = useProjectsService()
  const displayProject = React.useCallback(
    (project: Api.ProjectWithRelations) => {
      navigate(routeToProject(project.id))
    },
    [navigate, routeToProject]
  )
  return displayProject
}

/**
 * useCreateProject
 * This hook is used to create a project. It will navigate to the new project after creation.
 * this hook is not dependent of the ProjectContextProvider.
 */
export const useCreateProject = () => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routeToProject } = useProjectsService()
  const [createProject, createProjectProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.create({}))
        .with({ ok: false }, () => true)
        .otherwise(({ data }) => {
          navigate(routeToProject(data.project.id))
          return false
        }),
    t: _.prefixed("confirm.create"),
  })
  return [createProject, createProjectProps] as const
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRProjects) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const toggleStateProject = React.useCallback(
    async (project: Api.ProjectWithRelations) => {
      match(await service.id(project.id).update({ state: project.state === "draft" ? "published" : "draft" }))
        .with({ ok: true }, ({ data }) => swr.update(data.project))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return toggleStateProject
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRProjects) => {
  const [editProject, editProjectProps] = Ui.useQuickDialog<Api.ProjectWithRelations>({
    mutate: async (project) => swr.update(project),
  })
  return [editProject, editProjectProps] as const
}

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWRProjects) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => {
      if (slug.project) {
        swr.update({ id: slug.project.id, slug })
      }
    },
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRProjects) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const [confirmDeleteProject, confirmDeleteProjectProps] = Ui.useConfirm<Api.ProjectWithRelations>({
    onAsyncConfirm: async (project) =>
      match(await service.id(project.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(project.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteProject, confirmDeleteProjectProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRProjects, selectable: Selectable<Api.ProjectWithRelations>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
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
 * ManageProject type
 */
export type ManageProject = ReturnType<typeof useManageProject>[0]

/**
 * useManageProject
 */
export const useManageProject = (swr: SWRProjects, selectable: Selectable<Api.ProjectWithRelations>) => {
  const displayProject = useDisplay()
  const [createProject, createProjectProps] = useCreateProject()
  const toggleStateProject = useToggleState(swr)
  const [editProject, editProjectProps] = useEdit(swr)
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const [confirmDeleteProject, confirmDeleteProjectProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const managePage = {
    displayProject,
    createProject,
    toggleStateProject,
    editProject,
    editSlug,
    confirmDeleteProject,
    confirmDeleteSelection,
  }

  const managePageProps = {
    createProjectProps,
    editProjectProps,
    editSlugProps,
    confirmDeleteProjectProps,
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
      create: {
        title: "Create project",
        description:
          "You are about to create a project, if you want to continue you will be redirected to the new project.",
        success: "New project created",
        error: "Error while creating project",
        progress: "Creating project",
      },
      delete: {
        title: "Delete project",
        success: "Project has been deleted",
        error: "Error while deleting project",
        progress: "Deleting project",
      },
      "delete-selection": {
        title: "Delete selected projects",
        success: "Projects have been deleted",
        error: "Error while deleting projects",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      create: {
        title: "Créer un projet",
        description:
          "Vous êtes sur le point de créer un projet, si vous souhaitez continuer vous serez redirigé vers le nouvel projet.",
        success: "Nouveau projet créé",
        error: "Erreur lors de la création du projet",
        progress: "Création du projet en cours",
      },
      delete: {
        title: "Supprimer le projet",
        success: "Le projet a été supprimé",
        error: "Erreur lors de la suppression du projet",
        progress: "Suppression du projet en cours",
      },
      "delete-selection": {
        title: "Supprimer les projets sélectionnés",
        success: "Les projets ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      create: {
        title: "Projekt erstellen",
        description:
          "Sie sind dabei, ein Projekt zu erstellen. Wenn Sie fortfahren möchten, werden Sie zum neuen Projekt weitergeleitet.",
        success: "Neues Projekt erstellt",
        error: "Fehler beim Erstellen des Projekts",
        progress: "Projekt wird erstellt",
      },
      delete: {
        title: "Projekt löschen",
        success: "Projekt wurde gelöscht",
        error: "Fehler beim Löschen des Projekts",
        progress: "Projekt wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Projekte löschen",
        success: "Projekte wurden gelöscht",
        error: "Fehler beim Löschen der Projekte",
        progress: "Lösche {{counter}} / {{total}}",
      },
    },
  },
}
