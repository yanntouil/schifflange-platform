import { useWorkspace } from "@/features/workspaces"
import { useTranslation } from "@compo/localize"
import { useCreatePage } from "@compo/pages"
import { Icon, Ui } from "@compo/ui"
import { Files, LayoutTemplate } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import routeToPages from "."
import routeToStats from "./stats"
import routeToTemplates from "./templates"

/**
 * Dashboard Pages Sidebar
 * this sidebar is used to navigate between the dashboard pages
 */
export const SidebarPages: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const titleIconRef = React.useRef<Icon.LayoutPanelTopHandle>(null)
  const createIconRef = React.useRef<Icon.FilePenLineHandle>(null)
  const statsIconRef = React.useRef<Icon.ChartPieHandle>(null)
  const [createPage, createPageProps] = useCreatePage()
  const { workspace } = useWorkspace()
  return (
    <>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-pages-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton
            tooltip={_("title")}
            onMouseEnter={() => titleIconRef.current?.startAnimation()}
            onMouseLeave={() => titleIconRef.current?.stopAnimation()}
          >
            <Icon.LayoutPanelTop className="size-4" ref={titleIconRef} />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={routeToPages()}>
                <Files aria-hidden />
                <span>{_("list")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => createIconRef.current?.startAnimation()}
              onMouseLeave={() => createIconRef.current?.stopAnimation()}
            >
              <button onClick={() => createPage()}>
                <Icon.FilePenLine className="size-4" ref={createIconRef} />
                <span>{_("create")}</span>
              </button>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={routeToTemplates()}>
                <LayoutTemplate aria-hidden />
                <span>{_("templates")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => statsIconRef.current?.startAnimation()}
              onMouseLeave={() => statsIconRef.current?.stopAnimation()}
            >
              <Link to={routeToStats()}>
                <Icon.ChartPie className="size-4" ref={statsIconRef} />
                <span>{_("stats")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
      <Ui.Confirm {...createPageProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Pages",
    list: "Afficher les pages",
    create: "Créer une nouvelle page",
    stats: "Afficher les statistiques",
    templates: "Gérer les modèles",
  },
  en: {
    title: "Pages",
    list: "Show all pages",
    create: "Create a new page",
    stats: "Show statistics",
    templates: "Manage templates",
  },
  de: {
    title: "Seiten",
    list: "Alle Seiten anzeigen",
    create: "Neue Seite erstellen",
    stats: "Statistiken anzeigen",
    templates: "Manage templates",
  },
}
