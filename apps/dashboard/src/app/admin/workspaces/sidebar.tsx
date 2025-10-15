import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { SwatchBook } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import adminWorkspacesIndexRouteTo from "."
import { CreateWorkspaceDialog } from "./create"
import adminWorkspacesLogsRouteTo from "./logs"
import adminWorkspacesThemesRouteTo from "./themes"

/**
 * Admin SidebarWorkspaces
 * this sidebar is used to navigate between the admin workspaces
 */
export const SidebarWorkspaces: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const titleIconRef = React.useRef<Icon.BlocksHandle>(null)
  const listIconRef = React.useRef<Icon.BlocksHandle>(null)
  const createIconRef = React.useRef<Icon.BlocksPlusHandle>(null)
  const logIconRef = React.useRef<Icon.HistoryHandle>(null)
  return (
    <Ui.Sidebar.Menu>
      <Ui.Sidebar.CollapsibleMenuItem persistKey="admin-workspaces-sidebar">
        <Ui.Sidebar.CollapsibleMenuButton
          tooltip={_("title")}
          onMouseEnter={() => titleIconRef.current?.startAnimation()}
          onMouseLeave={() => titleIconRef.current?.stopAnimation()}
        >
          <Icon.Blocks className="size-4" ref={titleIconRef} />
          <span>{_("title")}</span>
        </Ui.Sidebar.CollapsibleMenuButton>
        <Ui.Sidebar.CollapsibleMenuSub>
          <Ui.Sidebar.CollapsibleMenuSubButton
            onMouseEnter={() => listIconRef.current?.startAnimation()}
            onMouseLeave={() => listIconRef.current?.stopAnimation()}
          >
            <Link to={adminWorkspacesIndexRouteTo()}>
              <Icon.Blocks className="size-4" ref={listIconRef} />
              <span>{_("list")}</span>
            </Link>
          </Ui.Sidebar.CollapsibleMenuSubButton>
          <CreateWorkspaceDialog>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => createIconRef.current?.startAnimation()}
              onMouseLeave={() => createIconRef.current?.stopAnimation()}
            >
              <Ui.Dialog.Trigger>
                <Icon.BlocksPlus className="size-4" ref={createIconRef} />
                <span>{_("create")}</span>
              </Ui.Dialog.Trigger>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </CreateWorkspaceDialog>
          <Ui.Sidebar.CollapsibleMenuSubButton>
            <Link to={adminWorkspacesThemesRouteTo()}>
              <SwatchBook className="size-4" />
              <span>{_("themes")}</span>
            </Link>
          </Ui.Sidebar.CollapsibleMenuSubButton>
          <Ui.Sidebar.CollapsibleMenuSubButton
            onMouseEnter={() => logIconRef.current?.startAnimation()}
            onMouseLeave={() => logIconRef.current?.stopAnimation()}
          >
            <Link to={adminWorkspacesLogsRouteTo()}>
              <Icon.History className="size-4" ref={logIconRef} />
              <span>{_("log")}</span>
            </Link>
          </Ui.Sidebar.CollapsibleMenuSubButton>
        </Ui.Sidebar.CollapsibleMenuSub>
      </Ui.Sidebar.CollapsibleMenuItem>
    </Ui.Sidebar.Menu>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Espaces de travail",
    list: "Afficher les espaces de travail",
    create: "Ajouter un espace de travail",
    themes: "Gérer les thèmes",
    log: "Afficher les activités",
  },
  en: {
    title: "Workspaces",
    list: "Show all workspaces",
    create: "Add a new workspace",
    themes: "Manage themes",
    log: "Show activity logs",
  },
  de: {
    title: "Arbeitsbereiche",
    list: "Alle Arbeitsbereiche anzeigen",
    create: "Neuen Arbeitsbereich hinzufügen",
    themes: "Themes verwalten",
    log: "Aktivitätsprotokolle anzeigen",
  },
}
