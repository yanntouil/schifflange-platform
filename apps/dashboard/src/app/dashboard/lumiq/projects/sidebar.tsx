import { useWorkspace } from "@/features/workspaces"
import { useTranslation } from "@compo/localize"
import { useCreateProject } from "@compo/projects"
import { Icon, Ui } from "@compo/ui"
import { Files, Folders, LayoutTemplate, Presentation, Tags } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardProjectsRouteTo from "."
import dashboardProjectsCategoriesRouteTo from "./categories"
import dashboardProjectsStatsRouteTo from "./stats"
import dashboardProjectsTagsRouteTo from "./tags"
import dashboardProjectsTemplatesRouteTo from "./templates"

/**
 * Dashboard Projects Sidebar
 * this sidebar is used to navigate between the dashboard projects
 */
export const SidebarProjects: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const titleIconRef = React.useRef<Icon.LayoutPanelTopHandle>(null)
  const createIconRef = React.useRef<Icon.FilePenLineHandle>(null)
  const statsIconRef = React.useRef<Icon.ChartPieHandle>(null)
  const [createProject, createProjectProps] = useCreateProject()
  const { workspace } = useWorkspace()
  return (
    <>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-projects-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Presentation aria-hidden />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardProjectsRouteTo()}>
                <Files aria-hidden />
                <span>{_("list")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => createIconRef.current?.startAnimation()}
              onMouseLeave={() => createIconRef.current?.stopAnimation()}
            >
              <button onClick={() => createProject()}>
                <Icon.FilePenLine className="size-4" ref={createIconRef} />
                <span>{_("create")}</span>
              </button>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardProjectsCategoriesRouteTo()}>
                <Folders aria-hidden />
                <span>{_("categories")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardProjectsTagsRouteTo()}>
                <Tags aria-hidden />
                <span>{_("tags")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardProjectsTemplatesRouteTo()}>
                <LayoutTemplate aria-hidden />
                <span>{_("templates")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => statsIconRef.current?.startAnimation()}
              onMouseLeave={() => statsIconRef.current?.stopAnimation()}
            >
              <Link to={dashboardProjectsStatsRouteTo()}>
                <Icon.ChartPie className="size-4" ref={statsIconRef} />
                <span>{_("stats")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
      <Ui.Confirm {...createProjectProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Projects",
    list: "Afficher les projets",
    create: "Créer un nouveau projet",
    categories: "Gérer les catégories",
    tags: "Gérer les tags",
    templates: "Gérer les modèles",
    stats: "Afficher les statistiques",
  },
  en: {
    title: "Projects",
    list: "Show all projects",
    create: "Create a new project",
    categories: "Manage categories",
    tags: "Manage tags",
    templates: "Manage templates",
    stats: "Show statistics",
  },
  de: {
    title: "Projekte",
    list: "Alle Projekte anzeigen",
    create: "Neues Projekt erstellen",
    categories: "Kategorien verwalten",
    tags: "Tags verwalten",
    templates: "Vorlagen verwalten",
    stats: "Statistiken anzeigen",
  },
}
