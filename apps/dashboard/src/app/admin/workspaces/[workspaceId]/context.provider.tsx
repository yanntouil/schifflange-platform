import { Api, service as apiService } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import React from "react"
import { useLocation } from "wouter"
import adminWorkspacesRouteTo from ".."
import { AccountEditDialog } from "../edit.account"
import { ProfileEditDialog } from "../edit.profile"
import { WorkspaceContext } from "./context"
import { useSwrWorkspace } from "./swr"

/**
 * provider
 */
export const WorkspaceProvider: React.FC<{
  children: React.ReactNode
  workspace: Api.Admin.Workspace
  swr: ReturnType<typeof useSwrWorkspace>["swr"]
}> = ({ children, workspace, swr }) => {
  const { _ } = useTranslation(dictionary)
  const service = apiService.admin.workspaces.id(workspace.id)
  // actions on workspace
  const [, navigate] = useLocation()
  const [editWorkspace, editWorkspaceProps] = Ui.useQuickDialog<Api.Admin.Workspace>({
    mutate: async (workspace) => swr.update(workspace),
  })
  const [editProfile, editProfileProps] = Ui.useQuickDialog<Api.Admin.Workspace>({
    mutate: async (workspace) => swr.update(workspace),
  })
  const [deleteWorkspace, deleteWorkspaceProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () => {
      return match(await service.delete())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          if ("workspace" in data && data.workspace)
            swr.update(data.workspace) // soft delete
          else navigate(adminWorkspacesRouteTo())
          return false
        })
    },
    t: _.prefixed(`confirm.delete`),
  })
  const actionsOnWorkspace = {
    edit: () => editWorkspace(workspace),
    editProfile: () => editProfile(workspace),
    delete: deleteWorkspace,
  }

  // actions on members
  const [removeMember, removeMemberProps] = Ui.useConfirm<Api.Admin.WorkspaceMember>({
    onAsyncConfirm: async (member) => {
      return match(await service.members.id(member.id).detach())
        .with({ failed: true }, () => true)
        .otherwise(() => {
          swr.rejectMember(member)
          return false
        })
    },
    t: _.prefixed(`confirm.remove-member`),
  })
  const changeRole = async (member: Api.Admin.WorkspaceMember, newRole: Api.WorkspaceRole) => {
    if (newRole === member.workspaceRole) return
    match(await service.members.id(member.id).update({ role: newRole }))
      .with({ ok: true }, ({ data }) => swr.updateMember(data.member))
      .otherwise(() => Ui.toast.error(_("change-role-error")))
  }
  const actionsOnMembers = {
    removeMember,
    changeRole,
  }

  // actions on invitations
  const [removeInvitation, removeInvitationProps] = Ui.useConfirm<Api.Admin.WorkspaceInvitation>({
    onAsyncConfirm: async (invitation) => {
      return match(await service.invitations.delete(invitation.id))
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          swr.updateInvitation(data.invitation)
          return false
        })
    },
    t: _.prefixed(`confirm.remove-invitation`),
  })
  const actionsOnInvitations = {
    removeInvitation,
  }

  const context = {
    ...actionsOnWorkspace,
    ...actionsOnMembers,
    ...actionsOnInvitations,
    workspace,
    swr,
    service,
  }
  return (
    <WorkspaceContext.Provider value={context}>
      {children}
      <AccountEditDialog {...editWorkspaceProps} />
      <ProfileEditDialog {...editProfileProps} />
      <Ui.Confirm {...deleteWorkspaceProps} />
      <Ui.Confirm {...removeMemberProps} />
      <Ui.Confirm {...removeInvitationProps} />
    </WorkspaceContext.Provider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "change-role-error": "Error while changing role",
    confirm: {
      delete: {
        title: "Delete workspace",
        success: "Workspace has been deleted",
        error: "Error while deleting workspace",
        progress: "Deleting workspace",
      },
      "remove-member": {
        title: "Remove member",
        success: "Member has been removed",
        error: "Error while removing member",
        progress: "Removing member",
      },
      "remove-invitation": {
        title: "Remove invitation",
        success: "Invitation has been removed",
        error: "Error while removing invitation",
        progress: "Removing invitation",
      },
    },
  },
  fr: {
    "change-role-error": "Erreur lors de la modification du rôle",
    confirm: {
      delete: {
        title: "Supprimer l'espace de travail",
        success: "L'espace de travail a été supprimé",
        error: "Erreur lors de la suppression de l'espace de travail",
        progress: "Suppression de l'espace de travail en cours",
      },
      "remove-member": {
        title: "Supprimer le membre",
        success: "Le membre a été supprimé",
        error: "Erreur lors de la suppression du membre",
        progress: "Suppression du membre en cours",
      },
      "remove-invitation": {
        title: "Supprimer l'invitation",
        success: "L'invitation a été supprimée",
        error: "Erreur lors de la suppression de l'invitation",
        progress: "Suppression de l'invitation en cours",
      },
    },
  },
  de: {
    "change-role-error": "Fehler beim Ändern der Rolle",
    confirm: {
      delete: {
        title: "Arbeitsbereich löschen",
        success: "Arbeitsbereich wurde gelöscht",
        error: "Fehler beim Löschen des Arbeitsbereichs",
        progress: "Arbeitsbereich wird gelöscht",
      },
      "remove-member": {
        title: "Mitglied entfernen",
        success: "Mitglied wurde entfernt",
        error: "Fehler beim Entfernen des Mitglieds",
        progress: "Mitglied wird entfernt",
      },
      "remove-invitation": {
        title: "Einladung entfernen",
        success: "Einladung wurde entfernt",
        error: "Fehler beim Entfernen der Einladung",
        progress: "Einladung wird entfernt",
      },
    },
  },
}
