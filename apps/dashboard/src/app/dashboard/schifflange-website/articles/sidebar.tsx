import { useWorkspace } from "@/features/workspaces"
import { service } from "@/services"
import { CategoriesCreateDialog, useCreateArticle, useCreateCategory } from "@compo/articles"
import { useTranslation } from "@compo/localize"
import { CreateTemplateDialog, TemplatesServiceProvider, useCreateTemplate } from "@compo/templates"
import { ContextualLanguageProvider } from "@compo/translations"
import { Icon, Ui } from "@compo/ui"
import { Files, Folders, LayoutTemplate, Newspaper, Plus } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

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
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-articles-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Newspaper className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            {/* articles list */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<ArticlePlusButton />}>
              <Link to={routesTo.list()}>
                <Files aria-hidden />
                <span>{_("list")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>

            {/* categories */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<CategoriesPlusButton />}>
              <Link to={routesTo.categories.list()}>
                <Folders aria-hidden />
                <span>{_("categories")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>

            {/* templates */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<TemplatesPlusButton />}>
              <Link to={routesTo.templates.list()}>
                <LayoutTemplate aria-hidden />
                <span>{_("templates")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>

            {/* stats */}
            <Ui.Sidebar.CollapsibleMenuSubButton
              onMouseEnter={() => statsIconRef.current?.startAnimation()}
              onMouseLeave={() => statsIconRef.current?.stopAnimation()}
            >
              <Link to={routesTo.stats()}>
                <Icon.ChartPie className="size-4" ref={statsIconRef} />
                <span>{_("stats")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
      <Ui.Confirm {...createArticleProps} />
    </ContextualLanguageProvider>
  )
}

/**
 * ArticlePlusButton
 * This button is used to create an article. It is only visible if the sidebar is expanded.
 */
const ArticlePlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateArticle()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-article")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <Ui.Confirm {...props} />
    </>
  )
}

/**
 * CategoriesPlusButton
 * This button is used to create a category. It is only visible if the sidebar is expanded.
 */
const CategoriesPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateCategory()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-category")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <CategoriesCreateDialog {...props} />
    </>
  )
}

/**
 * ContactPlusButton
 * This button is used to create an article. It is only visible if the sidebar is expanded.
 */
const TemplatesPlusButton: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <TemplatesServiceProvider
      service={service.workspaces.id(workspace.id).templates}
      serviceKey={`${workspace.id}-article-templates`}
      type="article"
      items={{}}
      routeToTemplates={routesTo.templates.list}
      routeToTemplate={routesTo.templates.byId}
    >
      <TemplatesPlusButtonInner />
    </TemplatesServiceProvider>
  )
}
const TemplatesPlusButtonInner: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateTemplate()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-template")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <CreateTemplateDialog {...props} />
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
    "create-article": "Créer un nouvel article",
    categories: "Gérer les catégories",
    "create-category": "Créer une nouvelle catégorie",
    templates: "Gérer les modèles",
    "create-template": "Créer un nouveau modèle",
    stats: "Afficher les statistiques",
  },
  en: {
    title: "Articles",
    list: "Show all articles",
    "create-article": "Create a new article",
    categories: "Manage categories",
    "create-category": "Create a new category",
    templates: "Manage templates",
    "create-template": "Create a new template",
    stats: "Show statistics",
  },
  de: {
    title: "Artikel",
    list: "Alle Artikel anzeigen",
    "create-article": "Neuen Artikel erstellen",
    categories: "Kategorien verwalten",
    "create-category": "Neue Kategorie erstellen",
    templates: "Vorlagen verwalten",
    "create-template": "Neue Vorlage erstellen",
    stats: "Statistiken anzeigen",
  },
}
