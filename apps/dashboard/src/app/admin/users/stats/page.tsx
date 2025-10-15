import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { BalanceStats } from "./stats.balance"
import { DispatchRolesStats } from "./stats.dispatch-roles"
import { DispatchStatusStats } from "./stats.dispatch-status"
import { LifetimeAnalytics } from "./stats.lifetime-analytics"
import { RecentsStats } from "./stats.recents-stats"
import { TopActivityStats } from "./stats.top-activity"
import { TrendChartStats } from "./stats.trend-chart"
import { useSwrStats } from "./swr"

/**
 * This page displays the stats of the users
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))

  const { stats, swr } = useSwrStats()

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-6 gap-6">
        <LifetimeAnalytics stats={stats} className="col-span-6 @2xl/dashboard:col-span-2" />
        <RecentsStats stats={stats} className="col-span-6 @2xl/dashboard:col-span-4" />
        <BalanceStats stats={stats} className="col-span-6 @2xl/dashboard:col-span-3" />
        <div className="col-span-6 grid grid-rows-2 gap-6 @2xl/dashboard:col-span-3">
          <DispatchRolesStats stats={stats} className="col-span-6 @2xl/dashboard:col-span-3" />
          <DispatchStatusStats stats={stats} className="col-span-6 @2xl/dashboard:col-span-3" />
        </div>
        <TopActivityStats stats={stats} className="col-span-6" />
        <TrendChartStats stats={stats} className="col-span-6" />
      </div>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Statistics",
    description: "View the statistics of the users",
  },
  fr: {
    title: "Statistiques",
    description: "Consultez les statistiques des utilisateurs",
  },
  de: {
    title: "Statistiken",
    description: "Sehen Sie die Statistiken der Benutzer",
  },
}
