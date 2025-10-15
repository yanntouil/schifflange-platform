import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, capitalize, D, match, slugify } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { BarChartMixed } from "../charts/bar-chart-mixed"
import { PieChartDonut } from "../charts/pie-chart-donut"
import { RadialChartShape } from "../charts/radial-chart-shape"
import { useTrackings } from "../hooks"
import { ChartData, ChartTypeName, StatsProps } from "../types"
import { prepareIntervalParams } from "../utils"

/**
 * BrowserChart
 */
export const BrowserChart = React.forwardRef<HTMLDivElement, StatsProps & { chartType: ChartTypeName }>(
  (
    { trackingId, trackings, interval, refreshInterval = 5000, chartType, label = "Visitors", onChartDataChange },
    ref
  ) => {
    const today = useToday()
    const { locale } = useTranslation()

    // request
    const service = useTrackings({ trackings, trackingId })
    const params = React.useMemo(
      () => prepareIntervalParams(interval, "days", today, locale),
      [interval, today, locale]
    )
    const { data } = useSWR(
      {
        fetch: () => service.byBrowser(params),
        key: useMemoKey("trackings-browser", params),
      },
      {
        fallbackData: { stats: {} },
        onSuccess: (data) => onChartDataChange?.(prepareData(data.stats)),
        refreshInterval,
      }
    )

    // prepare chart
    const chartProps = React.useMemo(
      () => ({
        chartData: prepareData(data.stats) as ChartData<{ fill: string }>,
        chartConfig: prepareConfig(data.stats, label),
        nameKey: "browser",
        dataKey: "views",
        labelKey: "browser",
      }),
      [data.stats, label]
    )

    return match(chartType)
      .with("donut", () => <PieChartDonut {...chartProps} ref={ref} />)
      .with("bar", () => <BarChartMixed {...chartProps} ref={ref} />)
      .with("radial", () => <RadialChartShape {...chartProps} ref={ref} />)
      .exhaustive()
  }
)

/**
 * prepare chart data
 */
const prepareData = (stats: Api.TracesStats) =>
  A.sortBy(
    A.map(D.toPairs(stats), ([browser, views]) => ({
      browser: slugify(browser),
      views,
      fill: `var(--color-${slugify(browser)})`,
    })),
    ({ views }) => views * -1
  ) as {
    browser: string
    views: number
    fill: string
  }[]

/**
 * prepare chart config
 */
const prepareConfig = (stats: Api.TracesStats, label: string) => ({
  views: {
    label,
  },
  ...D.fromPairs(
    A.mapWithIndex(
      D.keys(stats),
      (index, browser) =>
        [slugify(browser), { label: capitalize(browser), color: `var(--chart-${index + 1})` }] as const
    )
  ),
})
