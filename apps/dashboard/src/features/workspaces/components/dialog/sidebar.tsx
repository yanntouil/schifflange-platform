import { WorkspaceAvatar } from "@/app/dashboard/workspaces.avatar"
import { useAuthDialog } from "@/features/auth/components/dialog/context"
import { useLoadWorkspaces } from "@/features/workspaces"
import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { Check, Settings, UserPlus } from "lucide-react"
import React from "react"

/**
 * dialog workspaces
 * this component is used to display the workspaces tab in the auth dialog
 */
export const WorkspacesDialogSidebar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { tab, setTab } = useAuthDialog()
  const { workspaces, currentWorkspace } = useLoadWorkspaces()

  const openWorkspaceConfig = (workspaceId: string) => {
    setTab({ type: "workspaces-config", params: { workspaceId } })
  }

  const openWorkspaceMembers = (workspaceId: string) => {
    setTab({ type: "workspaces-members", params: { workspaceId } })
  }

  const openWorkspaceInvitations = (workspaceId: string) => {
    setTab({ type: "workspaces-invitations", params: { workspaceId } })
  }

  if (workspaces.length === 0) {
    return null
  }
  const openedWorkspace = tab?.params && "workspaceId" in tab.params ? tab.params.workspaceId : null
  return (
    <Ui.Sidebar.Group>
      <Ui.Sidebar.GroupContent>
        <Ui.Sidebar.GroupLabel>{_("workspaces")}</Ui.Sidebar.GroupLabel>
        <Ui.Sidebar.Menu>
          {workspaces.map((workspace) => {
            const isExpanded = tab?.type.startsWith("workspaces-") && openedWorkspace === workspace.id
            return (
              <Ui.Sidebar.MenuItem key={workspace.id}>
                <Ui.Sidebar.MenuButton
                  isActive={currentWorkspace?.id === workspace.id}
                  onClick={() => openWorkspaceConfig(workspace.id)}
                  tooltip={workspace.name}
                >
                  <WorkspaceAvatar workspace={workspace} size="size-4" classNames={{ fallback: "text-xs [&>svg]:size-2" }} />
                  <span className="truncate">{workspace.name}</span>
                  {currentWorkspace?.id === workspace.id && <Check className="ml-auto size-3 text-green-600" />}
                </Ui.Sidebar.MenuButton>
                {isExpanded && (
                  <Ui.Sidebar.MenuSub>
                    <Ui.Sidebar.MenuItem>
                      <Ui.Sidebar.MenuButton
                        isActive={tab?.type === "workspaces-config" && tab.params.workspaceId === workspace.id}
                        onClick={() => openWorkspaceConfig(workspace.id)}
                        tooltip={_("workspace-settings")}
                        size="sm"
                      >
                        <Settings className="size-4" />
                        <span>{_("workspace-settings")}</span>
                      </Ui.Sidebar.MenuButton>
                    </Ui.Sidebar.MenuItem>
                    <Ui.Sidebar.MenuItem>
                      <Ui.Sidebar.MenuButton
                        isActive={tab?.type === "workspaces-members" && tab.params.workspaceId === workspace.id}
                        onClick={() => openWorkspaceMembers(workspace.id)}
                        tooltip={_("manage-members")}
                        size="sm"
                      >
                        <Icon.Users className="size-4" />
                        <span>{_("manage-members")}</span>
                      </Ui.Sidebar.MenuButton>
                    </Ui.Sidebar.MenuItem>
                    <Ui.Sidebar.MenuItem>
                      <Ui.Sidebar.MenuButton
                        isActive={tab?.type === "workspaces-invitations" && tab.params.workspaceId === workspace.id}
                        onClick={() => openWorkspaceInvitations(workspace.id)}
                        tooltip={_("manage-invitations")}
                        size="sm"
                      >
                        <UserPlus className="size-4" />
                        <span>{_("manage-invitations")}</span>
                      </Ui.Sidebar.MenuButton>
                    </Ui.Sidebar.MenuItem>
                  </Ui.Sidebar.MenuSub>
                )}
              </Ui.Sidebar.MenuItem>
            )
          })}
        </Ui.Sidebar.Menu>
      </Ui.Sidebar.GroupContent>
    </Ui.Sidebar.Group>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    workspaces: "Workspaces",
    "workspace-settings": "Settings",
    "manage-members": "Members",
    "manage-invitations": "Invitations",
  },
  fr: {
    workspaces: "Espaces de travail",
    "workspace-settings": "Paramètres",
    "manage-members": "Membres",
    "manage-invitations": "Invitations",
  },
  de: {
    workspaces: "Arbeitsbereiche",
    "workspace-settings": "Einstellungen",
    "manage-members": "Mitglieder",
    "manage-invitations": "Einladungen",
  },
}
