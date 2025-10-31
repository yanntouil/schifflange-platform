import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { EventsProvider, Stats, useSwrEvents } from "@compo/events"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * events stats page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrEvents()
  const { service } = useWorkspace()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <EventsProvider swr={swr}>
        <Stats service={service.trackings} />
      </EventsProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Events Statistics",
    description: "Analytics and performance metrics for all events",
  },
  fr: {
    title: "Statistiques des événements",
    description: "Analyses et métriques de performance pour tous les événements",
  },
  de: {
    title: "Veranstaltungs-Statistiken",
    description: "Analysen und Leistungsmetriken für alle Veranstaltungen",
  },
}
