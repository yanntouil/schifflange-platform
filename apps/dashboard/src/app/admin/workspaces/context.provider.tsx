import { Api, service } from "@/services"
import { useKeepOnly, useSelectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import React from "react"
import { useLocation } from "wouter"
import adminWorkspacesIdRoute from "./[workspaceId]"
import { WorkspacesContext } from "./context"
import { CreateWorkspaceDialog } from "./create"
import { AccountEditDialog } from "./edit.account"
import { ProfileEditDialog } from "./edit.profile"
import { useSwrWorkspaces } from "./swr"

/**
 * provider
 */
export const WorkspacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { _ } = useTranslation(dictionary)

  // swr
  const { workspaces, metadata, total, swr } = useSwrWorkspaces()

  // actions on workspace
  const [createWorkspace, createWorkspaceProps] = Ui.useQuickDialog<void, any>({
    mutate: async (workspace) => swr.append(workspace),
  })
  const [editWorkspace, editWorkspaceProps] = Ui.useQuickDialog<Api.Admin.Workspace>({
    mutate: async (workspace) => swr.update(workspace),
  })
  const [editProfile, editProfileProps] = Ui.useQuickDialog<Api.Admin.Workspace>({
    mutate: async (workspace) => swr.update(workspace),
  })
  const [, navigate] = useLocation()
  const display = (workspace: Api.Workspace) => navigate(adminWorkspacesIdRoute(workspace.id))
  const [deleteWorkspace, deleteWorkspaceProps] = Ui.useConfirm<string>({
    onAsyncConfirm: async (id) => {
      return match(await service.admin.workspaces.id(id).delete())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          if ("workspace" in data && data.workspace)
            swr.update(data.workspace) // soft delete
          else swr.rejectById(id)
          return false
        })
    },
    t: _.prefixed(`confirm.delete`),
  })
  const actionsOnWorkspace = {
    create: createWorkspace,
    display,
    edit: editWorkspace,
    editProfile,
    delete: deleteWorkspace,
  }

  // actions on selection
  const selectable = useSelectable<{ id: string }>()
  // update selection on data change
  useKeepOnly(workspaces, selectable.keepOnly)
  const [deleteSelection, deleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) => {
      return match(await service.admin.workspaces.id(id).delete())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          if ("workspace" in data && data.workspace)
            swr.update(data.workspace) // soft delete
          else swr.rejectById(id)
          return false
        })
    },
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed(`confirm.delete-selection`),
  })
  const actionsOnSelection = {
    deleteSelection,
  }

  const context = {
    ...selectable,
    ...actionsOnWorkspace,
    ...actionsOnSelection,
    workspaces,
    metadata,
    total,
    swr,
  }
  return (
    <WorkspacesContext.Provider value={context}>
      {children}
      <CreateWorkspaceDialog {...createWorkspaceProps} />
      <AccountEditDialog {...editWorkspaceProps} />
      <ProfileEditDialog {...editProfileProps} />
      <Ui.Confirm {...deleteWorkspaceProps} />
      <Ui.Confirm {...deleteSelectionProps} />
    </WorkspacesContext.Provider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete workspace",
        success: "Workspace has been deleted",
        error: "Error while deleting workspace",
        progress: "Deleting workspace",
      },
      "delete-selection": {
        title: "Delete selected workspaces",
        success: "Workspaces have been deleted",
        error: "Error while deleting workspaces",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'espace de travail",
        success: "L'espace de travail a été supprimé",
        error: "Erreur lors de la suppression de l'espace de travail",
        progress: "Suppression de l'espace de travail en cours",
      },
      "delete-selection": {
        title: "Supprimer les espaces de travail sélectionnés",
        success: "Les espaces de travail ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Arbeitsbereich löschen",
        success: "Arbeitsbereich wurde gelöscht",
        error: "Fehler beim Löschen des Arbeitsbereichs",
        progress: "Arbeitsbereich wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Arbeitsbereiche löschen",
        success: "Arbeitsbereiche wurden gelöscht",
        error: "Fehler beim Löschen",
        progress: "Lösche {{counter}} / {{total}}",
      },
    },
  },
}
