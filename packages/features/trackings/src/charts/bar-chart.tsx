import { Recharts, Ui } from "@compo/ui"
import React from "react"
import { ChartData } from "../types"

/**
 * BarChart
 */
export const BarChart = React.forwardRef<
  HTMLDivElement,
  {
    chartData: ChartData
    chartConfig: Ui.ChartConfig
    xDataKey: string
    xTickFormatter: (value: string) => string
    yDataKey: string
    labelFormatter: (value: string) => string
  }
>(({ chartData, chartConfig, xDataKey, xTickFormatter, yDataKey, labelFormatter }, ref) => {
  return (
    <Ui.Chart.Container config={chartConfig} className='aspect-video w-full' ref={ref}>
      <Recharts.BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis
          dataKey={xDataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={20}
          tickFormatter={xTickFormatter}
        />
        <Ui.Chart.Tooltip
          cursor={false}
          content={<Ui.Chart.TooltipContent className='w-[150px]' nameKey={yDataKey} labelFormatter={labelFormatter} />}
        />
        <Recharts.Bar dataKey={yDataKey} fill={`var(--color-${yDataKey})`} radius={4} />
      </Recharts.BarChart>
    </Ui.Chart.Container>
  )
})
