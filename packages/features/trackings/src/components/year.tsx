import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, F, pipe, T } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { BarChart } from "../charts/bar-chart"
import { useTrackings } from "../hooks"
import { StatsInterval, StatsProps } from "../types"
import { parseIsoYear, prepareIntervalParams } from "../utils"

/**
 * YearChart
 */
export const YearChart = React.forwardRef<HTMLDivElement, StatsProps>(
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
        fetch: () => service.byYear({ ...params }),
        key: useMemoKey("trackings-year", { ...params }),
      },
      {
        fallbackData: { stats: {} },
        onSuccess: (data) => onChartDataChange?.(prepareData(data.stats, interval, today)),
        refreshInterval,
      }
    )

    // prepare data
    const chartData = React.useMemo(() => prepareData(data.stats, interval, today), [data, interval, today])

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
      xTickFormatter: (value: string) => T.format(parseIsoYear(value), "yyyy", { locale }),
      yDataKey: "views",
      labelFormatter: (value: string) => `Year ${T.format(parseIsoYear(value), "yyyy", { locale })} `,
      chartData,
      chartConfig,
    }

    return <BarChart {...props} ref={ref} />
  }
)

/**
 * prepare chart data
 */
const prepareData = (stats: Api.TracesStats, interval: StatsInterval, today: Date) => {
  const start = interval.from ?? pipe(D.keys(stats), A.map(parseIsoYear), A.sortBy(F.identity), A.head) ?? today
  const year = T.eachYearOfInterval({ start, end: interval.to ?? today })
  return A.map(year, (date) => {
    const key = T.format(date, "yyyy")
    return { date: key, views: D.get(stats, key) ?? 0 }
  }) as {
    date: string
    views: number
  }[]
}
