import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { Mail } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import adminUsersRouteTo from "."
import { CreateUserDialog } from "./create"
import adminUsersEmailsRouteTo from "./emails"
import adminUsersLogsRouteTo from "./logs"
import adminUsersStatsRouteTo from "./stats"

/**
 * Admin SidebarUsers
 * this sidebar is used to navigate between the admin users
 */
export const SidebarUsers: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const titleIconRef = React.useRef<Icon.UsersHandle>(null)
  const listIconRef = React.useRef<Icon.UsersHandle>(null)
  const createIconRef = React.useRef<Icon.UserRoundPlusHandle>(null)
  const logIconRef = React.useRef<Icon.HistoryHandle>(null)
  const statsIconRef = React.useRef<Icon.ChartPieHandle>(null)
  return (
    <Ui.Sidebar.Menu>
      <Ui.Sidebar.CollapsibleMenuItem persistKey="admin-users-sidebar">
        <Ui.Sidebar.CollapsibleMenuButton
          tooltip={_("title")}
          onMouseEnter={() => titleIconRef.current?.startAnimation()}
          onMouseLeave={() => titleIconRef.current?.stopAnimation()}
        >
          <Icon.Users className="size-4" ref={titleIconRef} />
          <span>{_("title")}</span>
        </Ui.Sidebar.CollapsibleMenuButton>
        <Ui.Sidebar.CollapsibleMenuSub>
          <Ui.Sidebar.CollapsibleMenuSubButton
            onMouseEnter={() => listIconRef.current?.startAnimation()}
            onMouseLeave={() => listIconRef.current?.stopAnimation()}
          >
            <Link to={adminUsersRouteTo()}>
              <Icon.Users className="size-4" ref={listIconRef} />
              <span>{_("list")}</span>
            </Link>
          </Ui.Sidebar.CollapsibleMenuSubButton>
          <CreateUserDialog>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => createIconRef.current?.startAnimation()}
              onMouseLeave={() => createIconRef.current?.stopAnimation()}
            >
              <Ui.Dialog.Trigger>
                <Icon.UserRoundPlus className="size-4" ref={createIconRef} />
                <span>{_("create")}</span>
              </Ui.Dialog.Trigger>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </CreateUserDialog>
          <Ui.Sidebar.CollapsibleMenuSubButton
            onMouseEnter={() => logIconRef.current?.startAnimation()}
            onMouseLeave={() => logIconRef.current?.stopAnimation()}
          >
            <Link to={adminUsersLogsRouteTo()}>
              <Icon.History className="size-4" ref={logIconRef} />
              <span>{_("log")}</span>
            </Link>
          </Ui.Sidebar.CollapsibleMenuSubButton>
          <Ui.Sidebar.CollapsibleMenuSubButton>
            <Link to={adminUsersEmailsRouteTo()}>
              <Mail className="size-4" aria-hidden />
              <span>{_("emails")}</span>
            </Link>
          </Ui.Sidebar.CollapsibleMenuSubButton>
          <Ui.Sidebar.CollapsibleMenuSubButton
            onMouseEnter={() => statsIconRef.current?.startAnimation()}
            onMouseLeave={() => statsIconRef.current?.stopAnimation()}
          >
            <Link to={adminUsersStatsRouteTo()}>
              <Icon.ChartPie className="size-4" ref={statsIconRef} />
              <span>{_("stats")}</span>
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
    title: "Utilisateurs",
    list: "Afficher les utilisateurs",
    create: "Ajouter un utilisateur",
    log: "Afficher les activités",
    emails: "Afficher les emails",
    stats: "Afficher les statistiques",
  },
  en: {
    title: "Users",
    list: "Show all users",
    create: "Add a new user",
    log: "Show activity logs",
    emails: "Show emails",
    stats: "Show statistics",
  },
  de: {
    title: "Benutzer",
    list: "Alle Benutzer anzeigen",
    create: "Neuen Benutzer hinzufügen",
    log: "Aktivitätsprotokolle anzeigen",
    emails: "E-Mails anzeigen",
    stats: "Statistiken anzeigen",
  },
}
