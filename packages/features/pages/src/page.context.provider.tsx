import { useTranslation } from "@compo/localize"
import { EditSlugDialog } from "@compo/slugs"
import { StatsDialog } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { PageContext, usePage } from "./page.context"
import { useManagePage } from "./page.context.actions"
import { SWRSafePage } from "./swr.page"

/**
 * PagesProvider
 */
type PageProviderProps = {
  swr: SWRSafePage
  trackingService: Api.TrackingService
  children: React.ReactNode
}

export const PageProvider: React.FC<PageProviderProps> = ({ swr, trackingService, children }) => {
  const contextId = React.useId()
  const [managePage, managePageProps] = useManagePage(swr, trackingService)
  const contextProps = React.useMemo(() => ({ contextId, swr }), [contextId, swr])
  const value = React.useMemo(() => ({ ...contextProps, ...managePage, swr }), [contextProps, managePage, swr])

  return (
    <PageContext.Provider key={contextId} value={value}>
      {children}
      <ManagePage {...managePageProps} key={`${contextId}-managePage`} />
    </PageContext.Provider>
  )
}

/**
 * ManagePage
 */
type ManagePageProps = ReturnType<typeof useManagePage>[1]
const ManagePage: React.FC<ManagePageProps> = ({
  displayStatsProps,
  confirmDeleteProps,
  editSlugProps,
  trackingService,
}) => {
  const { _ } = useTranslation(dictionary)

  const { swr } = usePage()
  return (
    <>
      <StatsDialog
        {...displayStatsProps}
        trackingId={swr.page.tracking.id}
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
    "stats-title": "Statistiques de la page",
    "stats-description": "Choisissez le type de statistiques à afficher, la période et la manière de les visualiser",
  },
  en: {
    "stats-title": "Page stats",
    "stats-description": "Select the type of stats to display, range of time and how to display them",
  },
  de: {
    "stats-title": "Seitenstatistiken",
    "stats-description": "Wählen Sie den anzuzeigenden Statistiktyp, den Zeitbereich und die Darstellungsweise",
  },
}
