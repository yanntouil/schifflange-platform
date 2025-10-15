import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, F, match, pipe, T } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { BarChart } from "../charts/bar-chart"
import { useTrackings } from "../hooks"
import { StatsInterval, StatsProps } from "../types"
import { parseIsoMonth, prepareIntervalParams } from "../utils"

/**
 * MonthChart
 */
export const MonthChart = React.forwardRef<HTMLDivElement, StatsProps>(
  (
    {
      trackingId,
      trackings,
      interval,
      refreshInterval = 5000,
      label = "Visits",
      display = "visits",
      onChartDataChange,
    },
    ref
  ) => {
    const today = useToday()
    const { locale } = useTranslation()

    // request
    const service = useTrackings({ trackings, trackingId })
    const params = React.useMemo(
      () => prepareIntervalParams(interval, "months", today, locale),
      [interval, today, locale]
    )
    const { data } = useSWR(
      {
        fetch: () => service.byMonth(params),
        key: useMemoKey("trackings-month", params),
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
        color: match(display)
          .with("visits", () => "var(--chart-2)")
          .with("views", () => "var(--chart-3)")
          .with("clicks", () => "var(--chart-1)")
          .exhaustive(),
      },
      date: {
        label: "Date",
      },
    }

    const props = {
      xDataKey: "date",
      xTickFormatter: (value: string) => T.format(parseIsoMonth(value), "MMM", { locale }),
      yDataKey: "views",
      labelFormatter: (value: string) => `${T.format(parseIsoMonth(value), "MMMM yyyy", { locale })} `,
      chartData,
      chartConfig,
    }

    return <BarChart {...props} ref={ref} />
  }
)

const prepareData = (stats: Api.TracesStats, interval: StatsInterval, today: Date) => {
  const start = interval.from ?? pipe(D.keys(stats), A.map(parseIsoMonth), A.sortBy(F.identity), A.head) ?? today
  const month = T.eachMonthOfInterval({ start, end: interval.to ?? today })
  return A.map(month, (date) => {
    const key = T.format(date, "yyyy-MM")
    return { date: key, views: D.get(stats, key) ?? 0 }
  }) as {
    date: string
    views: number
  }[]
}
