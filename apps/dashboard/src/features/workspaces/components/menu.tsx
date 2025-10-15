import { dashboardRoutesByType } from "@/app/dashboard"
import { useAuthDialog } from "@/features/auth/components/dialog/context"
import { useLoadWorkspaces, workspaceStore } from "@/features/workspaces"
import { WorkspaceAvatar } from "@/features/workspaces/components/avatar"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Check, ExternalLink, Settings, UserPlus, Users, X } from "lucide-react"
import React from "react"
import { useLocation } from "wouter"
import { acceptInvitation, refuseInvitation } from "../store/actions"

/**
 * display list of workspaces and ability to switch between them and open dialog to manage workspaces
 */
export const WorkspaceMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { setTab } = useAuthDialog()
  const [, navigate] = useLocation()
  const { workspaces, invitations, currentWorkspace } = useLoadWorkspaces()
  const [processingInvitationId, setProcessingInvitationId] = React.useState<string | null>(null)

  const { signInToWorkspace } = workspaceStore.actions

  const changeWorkspace = async (workspaceId: string) => {
    match(await signInToWorkspace(workspaceId))
      .with({ ok: true }, ({ data }) => {
        navigate(dashboardRoutesByType(data.workspace.type))
      })
      .otherwise((error) => {
        console.error("Failed to sign in:", error)
      })
  }

  const openWorkspaceConfig = (workspaceId: string) => {
    setTab({ type: "workspaces-config", params: { workspaceId } })
  }

  const openWorkspaceMembers = (workspaceId: string) => {
    setTab({ type: "workspaces-members", params: { workspaceId } })
  }

  const openWorkspaceInvitations = (workspaceId: string) => {
    setTab({ type: "workspaces-invitations", params: { workspaceId } })
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    setProcessingInvitationId(invitationId)
    const result = await acceptInvitation(invitationId)
    setProcessingInvitationId(null)
    if (result) {
      Ui.toast.success(_("invitation-accepted-success"))
      // Navigate to the accepted workspace
      if (currentWorkspace) {
        navigate(dashboardRoutesByType(currentWorkspace.type))
      }
    } else {
      Ui.toast.error(_("invitation-accepted-error"))
    }
  }

  const handleRefuseInvitation = async (invitationId: string) => {
    setProcessingInvitationId(invitationId)
    const result = await refuseInvitation(invitationId)
    setProcessingInvitationId(null)
    if (result) {
      Ui.toast.success(_("invitation-refused-success"))
    } else {
      Ui.toast.error(_("invitation-refused-error"))
    }
  }

  if (workspaces.length === 0 && invitations.length === 0) {
    return null
  }

  return (
    <>
      <Ui.DropdownMenu.Label>{_("workspaces")}</Ui.DropdownMenu.Label>
      {workspaces.map((workspace) => (
        <Ui.DropdownMenu.Sub key={workspace.id}>
          <Ui.DropdownMenu.SubTrigger className="gap-3">
            <WorkspaceAvatar workspace={workspace} size="size-4" classNames={{ fallback: "text-xs [&>svg]:size-2" }} />
            <span className="flex-1 truncate">{workspace.name}</span>
            {currentWorkspace?.id === workspace.id && <Check className="size-3 text-green-600" />}
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.Portal>
            <Ui.DropdownMenu.SubContent>
              {/* Access workspace */}
              <Ui.DropdownMenu.Item onClick={() => changeWorkspace(workspace.id)}>
                <ExternalLink className="size-4" />
                {_("access-workspace")}
              </Ui.DropdownMenu.Item>
              <Ui.DropdownMenu.Separator />
              {/* Configuration */}
              <Ui.DropdownMenu.Item onClick={() => openWorkspaceConfig(workspace.id)}>
                <Settings className="size-4" />
                {_("workspace-settings")}
              </Ui.DropdownMenu.Item>
              {/* Members management */}
              <Ui.DropdownMenu.Item onClick={() => openWorkspaceMembers(workspace.id)}>
                <Users className="size-4" />
                {_("manage-members")}
              </Ui.DropdownMenu.Item>
              {/* Invitations management */}
              <Ui.DropdownMenu.Item onClick={() => openWorkspaceInvitations(workspace.id)}>
                <UserPlus className="size-4" />
                {_("manage-invitations")}
              </Ui.DropdownMenu.Item>
            </Ui.DropdownMenu.SubContent>
          </Ui.DropdownMenu.Portal>
        </Ui.DropdownMenu.Sub>
      ))}
      {invitations.map((invitation) => (
        <Ui.DropdownMenu.Sub key={invitation.id}>
          <Ui.DropdownMenu.SubTrigger className="gap-3" disabled={processingInvitationId === invitation.id}>
            <WorkspaceAvatar workspace={invitation.workspace} size="size-4" classNames={{ fallback: "text-xs [&>svg]:size-2" }} />
            <span className="flex-1 truncate">{invitation.workspace.name}</span>
            <span className="rounded-md bg-orange-500/10 px-1 py-0.5 text-xs text-orange-600">{_("invitation-pending")}</span>
          </Ui.DropdownMenu.SubTrigger>
          <Ui.DropdownMenu.Portal>
            <Ui.DropdownMenu.SubContent>
              {/* Accept invitation */}
              <Ui.DropdownMenu.Item onClick={() => handleAcceptInvitation(invitation.id)} disabled={processingInvitationId !== null}>
                <Check className="size-4" />
                {_("invitation-accept")}
              </Ui.DropdownMenu.Item>
              {/* Refuse invitation */}
              <Ui.DropdownMenu.Item onClick={() => handleRefuseInvitation(invitation.id)} disabled={processingInvitationId !== null}>
                <X className="size-4" />
                {_("invitation-refuse")}
              </Ui.DropdownMenu.Item>
            </Ui.DropdownMenu.SubContent>
          </Ui.DropdownMenu.Portal>
        </Ui.DropdownMenu.Sub>
      ))}
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    workspaces: "Mes espaces de travail",
    "access-workspace": "Accéder à l'espace",
    "workspace-settings": "Paramètres",
    "manage-members": "Gérer les membres",
    "manage-invitations": "Gérer les invitations",
    "invitation-pending": "En attente",
    "invitation-accept": "Accepter l'invitation",
    "invitation-refuse": "Refuser l'invitation",
    "invitation-accepted-success": "Invitation acceptée avec succès",
    "invitation-accepted-error": "Échec de l'acceptation de l'invitation",
    "invitation-refused-success": "Invitation refusée",
    "invitation-refused-error": "Échec du refus de l'invitation",
  },
  en: {
    workspaces: "My workspaces",
    "access-workspace": "Access workspace",
    "workspace-settings": "Settings",
    "manage-members": "Manage members",
    "manage-invitations": "Manage invitations",
    "invitation-pending": "Pending",
    "invitation-accept": "Accept invitation",
    "invitation-refuse": "Refuse invitation",
    "invitation-accepted-success": "Invitation accepted successfully",
    "invitation-accepted-error": "Failed to accept invitation",
    "invitation-refused-success": "Invitation refused",
    "invitation-refused-error": "Failed to refuse invitation",
  },
  de: {
    workspaces: "Meine Arbeitsbereiche",
    "access-workspace": "Auf Arbeitsbereich zugreifen",
    "workspace-settings": "Einstellungen",
    "manage-members": "Mitglieder verwalten",
    "manage-invitations": "Einladungen verwalten",
    "invitation-pending": "Ausstehend",
    "invitation-accept": "Einladung akzeptieren",
    "invitation-refuse": "Einladung ablehnen",
    "invitation-accepted-success": "Einladung erfolgreich akzeptiert",
    "invitation-accepted-error": "Fehler beim Akzeptieren der Einladung",
    "invitation-refused-success": "Einladung abgelehnt",
    "invitation-refused-error": "Fehler beim Ablehnen der Einladung",
  },
}
