import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, T } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { LineChart } from "../charts/line-chart"
import { useTrackings } from "../hooks"
import { StatsInterval, StatsProps } from "../types"
import { prepareIntervalParams } from "../utils"

/**
 * HourChart
 */
export const HourChart = React.forwardRef<HTMLDivElement, StatsProps>(
  (
    {
      trackingId,
      trackings,
      interval,
      refreshInterval = 5000,
      label = "Visitors",
      display = "views",
      onChartDataChange,
    },
    ref
  ) => {
    const today = useToday()
    const { locale } = useTranslation()

    // request
    const service = useTrackings({ trackings, trackingId })
    const params = React.useMemo(
      () => prepareIntervalParams(interval, "hours", today, locale),
      [interval, today, locale]
    )
    const { data } = useSWR(
      {
        fetch: () => service.byHour(params),
        key: useMemoKey("trackings-hour", params),
      },
      {
        fallbackData: { stats: {} },
        onSuccess: (data) => onChartDataChange?.(prepareData(data.stats, interval, today)),
        refreshInterval,
      }
    )

    // prepare data
    const chartData = React.useMemo(() => prepareData(data.stats, interval, today), [data.stats, interval, today])

    // prepare chart
    const chartConfig = {
      views: {
        label,
        color: display === "views" ? "var(--chart-2)" : "var(--chart-1)",
      },
      hour: {
        label: "Hour",
      },
    }

    return (
      <LineChart
        ref={ref}
        chartData={chartData}
        xDataKey='hour'
        xTickFormatter={(value: string) => T.format(value, "p", { locale })}
        yDataKey='views'
        labelFormatter={(value: string) => T.format(value, "PPp", { locale })}
        chartConfig={chartConfig}
      />
    )
  }
)

/**
 * prepare chart data
 */
const prepareData = (stats: Api.TracesStats, interval: StatsInterval, today: Date) => {
  const date = interval.to ?? today
  const hours = T.eachHourOfInterval({ start: T.startOfDay(date), end: T.endOfDay(date) })
  return A.map(hours, (hour) => {
    const statKey = `${T.formatISO(hour, { representation: "date" })}|${T.format(hour, "HH")}`
    const key = T.formatISO(hour)
    return { hour: key, views: D.get(stats, statKey) ?? 0 }
  }) as {
    hour: string
    views: number
  }[]
}
