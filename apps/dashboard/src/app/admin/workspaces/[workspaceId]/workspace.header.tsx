import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { WorkspaceAvatar } from "../workspaces.avatar"
import { useWorkspace } from "./context"
import { WorkspaceMenu } from "./workspace.menu"

/**
 * Workspace Header
 */
export const WorkspaceHeader: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()

  if (!workspace) {
    return (
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("loading")}</Dashboard.Title>
      </Dashboard.Header>
    )
  }

  return (
    <div className="flex justify-between gap-2">
      <div className="flex items-center gap-4">
        <WorkspaceAvatar workspace={workspace} />
        <Dashboard.Title>{placeholder(workspace.name, _("name-placeholder"))}</Dashboard.Title>
        <Ui.Badge
          tooltip={_(`status-${workspace.status}`)}
          side="right"
          variant={match(workspace.status)
            .with("active", () => "default" as const)
            .with("deleted", () => "destructive" as const)
            .with("suspended", () => "outline" as const)
            .exhaustive()}
        >
          {_(`status-${workspace.status}`)}
        </Ui.Badge>
      </div>
      <Ui.DropdownMenu.Quick menu={<WorkspaceMenu />} className="min-w-[16rem]">
        <Ui.Tooltip.Quick tooltip={_("menu-tooltip")} side="left" asChild>
          <Ui.Button variant="ghost" icon size="sm">
            <MoreHorizontal aria-hidden />
            <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "name-placeholder": "Unnamed workspace",
    "menu-tooltip": "Manage the workspace",
    "status-active": "Active",
    "status-suspended": "Suspended",
    "status-deleted": "Deleted",
  },
  fr: {
    "name-placeholder": "Espace de travail sans nom",
    "menu-tooltip": "Gérer l'espace de travail",
    "status-active": "Actif",
    "status-suspended": "Suspendu",
    "status-deleted": "Supprimé",
  },
  de: {
    "name-placeholder": "Unbenannter Arbeitsbereich",
    "menu-tooltip": "Arbeitsbereich verwalten",
    "status-active": "Aktiv",
    "status-suspended": "Gesperrt",
    "status-deleted": "Gelöscht",
  },
}
