import { TrackingServiceProvider } from "@compo/trackings"
import { type Api } from "@services/dashboard"
import React from "react"
import { LifetimeAnalytics } from "./lifetime-analytics"
import { RecentsStats } from "./recents-stats"
import { TopPerformingProjects } from "./top-performing-projects"
import { TrackingsCharts } from "./trackings-charts"
import { TrendChart } from "./trend-chart"

/**
 * Stats
 * display related stats for projects
 * this component must be wrapped in a ProjectsProvider
 */
export const Stats: React.FC<{ service: Api.TrackingService }> = ({ service }) => {
  return (
    <TrackingServiceProvider service={service}>
      <div className='@container/analytics mx-auto grid w-full max-w-7xl grid-cols-6 gap-6 pb-[100vh]'>
        <LifetimeAnalytics className='col-span-6 @2xl/analytics:col-span-2' />
        <RecentsStats className='col-span-6 @2xl/analytics:col-span-4' />
        <TopPerformingProjects className='col-span-6' />
        <TrendChart className='col-span-6' />
        <TrackingsCharts className='col-span-6' />
      </div>
    </TrackingServiceProvider>
  )
}
