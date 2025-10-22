import { useWorkspace } from "@/features/workspaces"
import { service } from "@/services"
import { useTranslation } from "@compo/localize"
import { useCreatePage } from "@compo/pages"
import { CreateTemplateDialog, TemplatesServiceProvider, useCreateTemplate } from "@compo/templates"
import { ContextualLanguageProvider } from "@compo/translations"
import { Icon, Ui } from "@compo/ui"
import { Files, LayoutTemplate, Plus } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Dashboard Pages Sidebar
 * this sidebar is used to navigate between the dashboard pages
 */
export const SidebarPages: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const titleIconRef = React.useRef<Icon.LayoutPanelTopHandle>(null)
  const statsIconRef = React.useRef<Icon.ChartPieHandle>(null)
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
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
            {/* pages list */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<PagePlusButton />}>
              <Link to={routesTo.list()}>
                <Files aria-hidden />
                <span>{_("list")}</span>
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
    </ContextualLanguageProvider>
  )
}

/**
 * PagePlusButton
 * This button is used to create a page. It is only visible if the sidebar is expanded.
 */
const PagePlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreatePage()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-page")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <Ui.Confirm {...props} />
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
      serviceKey={`${workspace.id}-page-templates`}
      type="page"
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
    title: "Pages",
    list: "Afficher les pages",
    "create-page": "Créer une nouvelle page",
    templates: "Gérer les modèles",
    "create-template": "Créer un nouveau modèle",
    stats: "Afficher les statistiques",
  },
  en: {
    title: "Pages",
    list: "Show all pages",
    "create-page": "Create a new page",
    templates: "Manage templates",
    "create-template": "Create a new template",
    stats: "Show statistics",
  },
  de: {
    title: "Seiten",
    list: "Alle Seiten anzeigen",
    "create-page": "Neue Seite erstellen",
    templates: "Vorlagen verwalten",
    "create-template": "Neue Vorlage erstellen",
    stats: "Statistiken anzeigen",
  },
}
