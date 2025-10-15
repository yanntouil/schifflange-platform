import { Recharts, Ui } from "@compo/ui"
import React from "react"
import { ChartData } from "../types"

/**
 * LineChart
 */
export const LineChart = React.forwardRef<
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
      <Recharts.LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {/* <CartesianGrid vertical={false} /> */}
        <Recharts.XAxis
          dataKey={xDataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={xTickFormatter}
        />
        <Ui.Chart.Tooltip
          content={<Ui.Chart.TooltipContent className='w-[150px]' nameKey={yDataKey} labelFormatter={labelFormatter} />}
        />
        <Recharts.Line
          dataKey={yDataKey}
          type='monotone'
          stroke={`var(--color-${yDataKey})`}
          strokeWidth={2}
          dot={false}
        />
      </Recharts.LineChart>
    </Ui.Chart.Container>
  )
})
