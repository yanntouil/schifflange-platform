import { TrackingServiceProvider } from "@compo/trackings"
import { type Api } from "@services/dashboard"
import React from "react"
import { LifetimeAnalytics } from "./stats.lifetime-analytics"
import { RecentsStats } from "./stats.recents"
import { TopPerformingEvents } from "./stats.top-performing-events"
import { TrackingsCharts } from "./stats.trackings-charts"
import { TrendChart } from "./stats.trend-chart"

/**
 * Stats
 * display related stats for pages
 * this component must be wrapped in a ArticlesProvider
 */
export const Stats: React.FC<{ service: Api.TrackingService }> = ({ service }) => {
  return (
    <TrackingServiceProvider service={service}>
      <div className='@container/analytics mx-auto grid w-full max-w-7xl grid-cols-6 gap-6 pb-[100vh]'>
        <LifetimeAnalytics className='col-span-6 @2xl/analytics:col-span-2' />
        <RecentsStats className='col-span-6 @2xl/analytics:col-span-4' />
        <TopPerformingEvents className='col-span-6' />
        <TrendChart className='col-span-6' />
        <TrackingsCharts className='col-span-6' />
      </div>
    </TrackingServiceProvider>
  )
}
