import { Dashboard } from "@compo/dashboard"
import { Events, EventsProvider, useEvents, useSwrEvents } from "@compo/events"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * events page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrEvents()
  return (
    <Dashboard.Container>
      <EventsProvider swr={swr} canSelectEvent multiple>
        <Header />
        <Events />
      </EventsProvider>
    </Dashboard.Container>
  )
}

export default Page

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createEvent: create } = useEvents()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => create()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Events Management",
    description: "Manage all website events, content and SEO",
    create: "Create a new event",
  },
  fr: {
    title: "Gestion des événements",
    description: "Gérer tous les événements, contenus et SEO du site",
    create: "Créer un nouvel événement",
  },
  de: {
    title: "Veranstaltungs-Verwaltung",
    description: "Verwalten Sie alle Website-Veranstaltungen, Inhalte und SEO",
    create: "Neue Veranstaltung erstellen",
  },
}
