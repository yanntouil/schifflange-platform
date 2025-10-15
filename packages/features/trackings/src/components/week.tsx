import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, F, pipe, T } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { Locale } from "date-fns"
import React from "react"
import { BarChart } from "../charts/bar-chart"
import { useTrackings } from "../hooks"
import { StatsInterval, StatsProps } from "../types"
import { parseIsoWeek, prepareIntervalParams } from "../utils"

/**
 * DayChart
 */
export const WeekChart = React.forwardRef<HTMLDivElement, StatsProps>(
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
      () => prepareIntervalParams(interval, "weeks", today, locale),
      [interval, today, locale]
    )
    const { data } = useSWR(
      {
        fetch: () => service.byWeek({ ...params }),
        key: useMemoKey("trackings-week", { ...params }),
      },
      {
        fallbackData: { stats: {} },
        onSuccess: (data) => onChartDataChange?.(prepareData(data.stats, interval, today, locale)),
        refreshInterval,
      }
    )

    // prepare data
    const chartData = React.useMemo(
      () => prepareData(data.stats, interval, today, locale),
      [data, interval, today, locale]
    )

    // prepare chart
    const chartConfig = {
      views: {
        label,
        color: display === "views" ? "var(--chart-2)" : "var(--chart-1)",
      },
      date: {
        label: "Date",
      },
    }

    const props = {
      xDataKey: "date",
      xTickFormatter: (value: string) => T.format(parseIsoWeek(value, locale), "ww", { locale }),
      yDataKey: "views",
      labelFormatter: (value: string) => `Week ${T.format(parseIsoWeek(value, locale), "ww yyyy", { locale })} `,
      chartData,
      chartConfig,
    }

    return <BarChart {...props} ref={ref} />
  }
)

/**
 * prepare chart data
 */
const prepareData = (stats: Api.TracesStats, interval: StatsInterval, today: Date, locale: Locale) => {
  const start =
    interval.from ??
    pipe(
      D.keys(stats),
      A.map((iso) => parseIsoWeek(iso, locale)),
      A.sortBy(F.identity),
      A.head
    ) ??
    today
  const week = T.eachWeekOfInterval(
    { start, end: interval.to ?? today },
    { locale, weekStartsOn: locale.options?.weekStartsOn }
  )
  return A.map(week, (date) => {
    const key = T.format(date, "yyyy-ww")
    return { date: key, views: D.get(stats, key) ?? 0 }
  }) as {
    date: string
    views: number
  }[]
}
