import { useTranslation } from "@compo/localize"
import { EditSlugDialog } from "@compo/slugs"
import { StatsDialog } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import React from "react"
import { EventContext, useEvent } from "./event.context"
import { useManageEvent } from "./event.context.actions"
import { SWRSafeEvent } from "./swr.event"

/**
 * EventsProvider
 */
type EventProviderProps = {
  swr: SWRSafeEvent
  trackingService: Api.TrackingService
  children: React.ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ swr, trackingService, children }) => {
  const contextId = React.useId()
  const [manageEvent, manageEventProps] = useManageEvent(swr, trackingService)
  const contextProps = React.useMemo(() => ({ contextId, swr }), [contextId, swr])
  const value = React.useMemo(() => ({ ...contextProps, ...manageEvent, swr }), [contextProps, manageEvent, swr])

  return (
    <EventContext.Provider key={contextId} value={value}>
      {children}
      <ManageEvent {...manageEventProps} key={`${contextId}-manageEvent`} />
    </EventContext.Provider>
  )
}

/**
 * ManageEvent
 */
type ManageEventProps = ReturnType<typeof useManageEvent>[1]
const ManageEvent: React.FC<ManageEventProps> = ({
  displayStatsProps,
  confirmDeleteProps,
  editSlugProps,
  trackingService,
}) => {
  const { _ } = useTranslation(dictionary)

  const { swr } = useEvent()
  return (
    <>
      <StatsDialog
        {...displayStatsProps}
        trackingId={swr.event.tracking.id}
        service={trackingService}
        title={_("stats-title")}
        description={_("stats-description")}
        display='views'
        defaultStats='visit'
        defaultDisplayBy='months'
      />
      <EditSlugDialog {...editSlugProps} />
      <Ui.Confirm {...confirmDeleteProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "stats-title": "Statistiques de l'événement",
    "stats-description": "Choisissez le type de statistiques à afficher, la période et la manière de les visualiser",
  },
  en: {
    "stats-title": "Event stats",
    "stats-description": "Select the type of stats to display, range of time and how to display them",
  },
  de: {
    "stats-title": "Veranstaltungs-Statistiken",
    "stats-description": "Wählen Sie den Typ der anzuzeigenden Statistiken, den Zeitraum und die Art der Darstellung",
  },
}
