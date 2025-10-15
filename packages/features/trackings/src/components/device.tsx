import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { A, D, capitalize, match, slugify } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { BarChartMixed } from "../charts/bar-chart-mixed"
import { PieChartDonut } from "../charts/pie-chart-donut"
import { RadialChartShape } from "../charts/radial-chart-shape"
import { useTrackings } from "../hooks"
import { ChartTypeName, StatsInterval, StatsProps } from "../types"
import { prepareIntervalParams } from "../utils"

/**
 * DeviceChart
 */
export const DeviceChart = React.forwardRef<HTMLDivElement, StatsProps & { chartType: ChartTypeName }>(
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
        fetch: () => service.byDevice(params),
        key: useMemoKey("trackings-device", params),
      },
      {
        fallbackData: { stats: {} },
        onSuccess: (data) => onChartDataChange?.(prepareData(data.stats, interval)),
        refreshInterval,
      }
    )

    // prepare chart
    const chartProps = React.useMemo(
      () => ({
        chartData: prepareData(data.stats, interval),
        chartConfig: prepareConfig(data.stats, label),
        nameKey: "device",
        dataKey: "views",
        labelKey: "device",
      }),
      [data.stats, interval, label]
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
const prepareData = (stats: Api.TracesStats, interval: StatsInterval) =>
  A.sortBy(
    A.map(D.toPairs(stats), ([device, views]) => ({
      device: slugify(device),
      views,
      fill: `var(--color-${slugify(device)})`,
    })),
    ({ views }) => views * -1
  ) as {
    device: string
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
      (index, device) => [slugify(device), { label: capitalize(device), color: `var(--chart-${index + 1})` }] as const
    )
  ),
})
