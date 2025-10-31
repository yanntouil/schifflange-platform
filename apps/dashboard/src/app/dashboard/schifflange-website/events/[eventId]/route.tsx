import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { EventProvider, useSwrEvent } from "@compo/events"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from ".."
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const RouteEventId: React.FC<{ eventId: string }> = ({ eventId }) => {
  const { _ } = useTranslation(dictionary)
  const { event, isLoading, isError, ...swr } = useSwrEvent(eventId)
  const { service } = useWorkspace()

  const breadcrumbs = useBreadcrumbs(eventId)
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(event)) return <Redirect to={parentTo()} />

  return (
    <EventProvider swr={{ ...swr, event }} trackingService={service.trackings}>
      <Page event={event} {...swr} />
    </EventProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Event Details",
  },
  fr: {
    title: "Détails de l'événement",
  },
  de: {
    title: "Veranstaltungdetails",
  },
}
