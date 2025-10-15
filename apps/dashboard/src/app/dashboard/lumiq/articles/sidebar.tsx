import { useWorkspace } from "@/features/workspaces"
import { useCreateArticle } from "@compo/articles"
import { useTranslation } from "@compo/localize"
import { Icon, Ui } from "@compo/ui"
import { Files, Folders, LayoutTemplate, Newspaper } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardArticlesRouteTo from "."
import dashboardArticlesCategoriesRouteTo from "./categories"
import dashboardArticlesStatsRouteTo from "./stats"
import dashboardArticlesTemplatesRouteTo from "./templates"

/**
 * Dashboard Articles Sidebar
 * this sidebar is used to navigate between the dashboard articles
 */
export const SidebarArticles: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const titleIconRef = React.useRef<Icon.LayoutPanelTopHandle>(null)
  const createIconRef = React.useRef<Icon.FilePenLineHandle>(null)
  const statsIconRef = React.useRef<Icon.ChartPieHandle>(null)
  const [createArticle, createArticleProps] = useCreateArticle()
  const { workspace } = useWorkspace()
  return (
    <>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-articles-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Newspaper className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardArticlesRouteTo()}>
                <Files aria-hidden />
                <span>{_("list")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => createIconRef.current?.startAnimation()}
              onMouseLeave={() => createIconRef.current?.stopAnimation()}
            >
              <button onClick={() => createArticle()}>
                <Icon.FilePenLine className="size-4" ref={createIconRef} />
                <span>{_("create")}</span>
              </button>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardArticlesCategoriesRouteTo()}>
                <Folders aria-hidden />
                <span>{_("categories")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardArticlesTemplatesRouteTo()}>
                <LayoutTemplate aria-hidden />
                <span>{_("templates")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => statsIconRef.current?.startAnimation()}
              onMouseLeave={() => statsIconRef.current?.stopAnimation()}
            >
              <Link to={dashboardArticlesStatsRouteTo()}>
                <Icon.ChartPie className="size-4" ref={statsIconRef} />
                <span>{_("stats")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
      <Ui.Confirm {...createArticleProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Articles",
    list: "Afficher les articles",
    create: "Créer un nouvel article",
    categories: "Gérer les catégories",
    templates: "Gérer les modèles",
    stats: "Afficher les statistiques",
  },
  en: {
    title: "Articles",
    list: "Show all articles",
    create: "Create a new article",
    categories: "Manage categories",
    templates: "Manage templates",
    stats: "Show statistics",
  },
  de: {
    title: "Artikel",
    list: "Alle Artikel anzeigen",
    create: "Neuen Artikel erstellen",
    categories: "Kategorien verwalten",
    templates: "Vorlagen verwalten",
    stats: "Statistiken anzeigen",
  },
}
