import { useWorkspace } from "@/features/workspaces"
import { service } from "@/services"
import { CategoriesCreateDialog, useCreateCategory, useCreateEvent, useMutateCategories, useMutateEvents } from "@compo/events"
import { EventsCreateDialog } from "@compo/events/src/components/events.create"
import { useTranslation } from "@compo/localize"
import { CreateTemplateDialog, TemplatesServiceProvider, useCreateTemplate, useMutateTemplates } from "@compo/templates"
import { ContextualLanguageProvider } from "@compo/translations"
import { Icon, Ui } from "@compo/ui"
import { Calendar, Files, Folders, LayoutTemplate, Plus } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Dashboard Events Sidebar
 * this sidebar is used to navigate between the dashboard events
 */
export const SidebarEvents: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const statsIconRef = React.useRef<Icon.ChartPieHandle>(null)
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-events-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Calendar className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            {/* events list */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<EventsPlusButton />}>
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
    </ContextualLanguageProvider>
  )
}

/**
 * EventsPlusButton
 * This button is used to create an event. It is only visible if the sidebar is expanded.
 */
const EventsPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { append } = useMutateEvents()
  const [create, props] = useCreateEvent(append)
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-event")} onClick={() => create()}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <EventsCreateDialog {...props} />
    </>
  )
}

/**
 * CategoriesPlusButton
 * This button is used to create a category. It is only visible if the sidebar is expanded.
 */
const CategoriesPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { append } = useMutateCategories()
  const [create, props] = useCreateCategory(append)
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-category")} onClick={() => create()}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <CategoriesCreateDialog {...props} />
    </>
  )
}

/**
 * TemplatesPlusButton
 * This button is used to create a template. It is only visible if the sidebar is expanded.
 */
const TemplatesPlusButton: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <TemplatesServiceProvider
      service={service.workspaces.id(workspace.id).templates}
      serviceKey={`${workspace.id}-event-templates`}
      type="event"
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
  const { append } = useMutateTemplates()
  const [create, props] = useCreateTemplate(append)
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-template")} onClick={() => create()}>
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
    title: "Événements",
    list: "Afficher les événements",
    "create-event": "Créer un nouvel événement",
    categories: "Gérer les catégories",
    "create-category": "Créer une nouvelle catégorie",
    templates: "Gérer les modèles",
    "create-template": "Créer un nouveau modèle",
    stats: "Afficher les statistiques",
  },
  en: {
    title: "Events",
    list: "Show all events",
    "create-event": "Create a new event",
    categories: "Manage categories",
    "create-category": "Create a new category",
    templates: "Manage templates",
    "create-template": "Create a new template",
    stats: "Show statistics",
  },
  de: {
    title: "Veranstaltungen",
    list: "Alle Veranstaltungen anzeigen",
    "create-event": "Neue Veranstaltung erstellen",
    categories: "Kategorien verwalten",
    "create-category": "Neue Kategorie erstellen",
    templates: "Vorlagen verwalten",
    "create-template": "Neue Vorlage erstellen",
    stats: "Statistiken anzeigen",
  },
}
