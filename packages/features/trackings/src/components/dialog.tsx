import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { TrackingServiceProvider } from "../context.provider"
import { TrackingCharts, TrackingChartsProps } from "./tracking-charts"

/**
 * StatsDialog
 */
type StatsDialogProps = Ui.QuickDialogProps<void> & {
  title: string
  description: string
  trackingId?: TrackingChartsProps["trackingId"]
  trackings?: TrackingChartsProps["trackings"]
  display?: TrackingChartsProps["display"]
  defaultStats?: TrackingChartsProps["defaultStats"]
  defaultDisplayBy?: TrackingChartsProps["defaultDisplayBy"]
  service: Api.TrackingService
}
export const StatsDialog: React.FC<StatsDialogProps> = ({
  title,
  description,
  trackingId,
  trackings,
  display,
  defaultStats,
  defaultDisplayBy,
  service,
  ...props
}) => {
  return (
    <Ui.QuickDialog
      {...props}
      title={title}
      description={description}
      classNames={{ content: "sm:max-w-3xl z-0", header: "z-10", close: "z-10" }}
      sticky
    >
      <TrackingServiceProvider service={service}>
        <TrackingCharts {...{ trackingId, trackings, display, defaultStats, defaultDisplayBy }} />
      </TrackingServiceProvider>
    </Ui.QuickDialog>
  )
}
