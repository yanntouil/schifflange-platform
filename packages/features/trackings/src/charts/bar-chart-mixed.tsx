import { Recharts, Ui } from "@compo/ui"
import { D, G } from "@compo/utils"
import React from "react"
import { ChartData } from "../types"

/**
 * BarChartMixed
 */
export const BarChartMixed = React.forwardRef<
  HTMLDivElement,
  {
    chartData: ChartData<{ fill: string }>
    chartConfig: Ui.ChartConfig
    nameKey: string
    dataKey: string
    labelKey: string
  }
>(({ chartData, chartConfig, nameKey, dataKey, labelKey }, ref) => {
  // the width of the y axis is n * max characters of the largest value
  const width = React.useMemo(() => {
    const max = Math.max(
      ...chartData.map((d) => {
        const value = D.get(d, nameKey)
        if (G.isString(value)) return value.length
        return 0
      })
    )
    return max * 12
  }, [chartData, nameKey])
  return (
    <div className='flex aspect-video items-center'>
      <Ui.Chart.Container config={chartConfig} className='aspect-[21/9] w-full' ref={ref}>
        <Recharts.BarChart
          accessibilityLayer
          data={chartData}
          layout='vertical'
          margin={{
            left: 0,
          }}
        >
          <Recharts.YAxis
            dataKey={labelKey}
            type='category'
            tickLine={false}
            tickMargin={10}
            width={width}
            axisLine={false}
            tickFormatter={(value) => {
              if (!G.isString(value)) return value
              return D.get(chartConfig, value)?.label ?? value
            }}
          />
          <Recharts.XAxis dataKey={dataKey} type='number' hide />
          <Ui.Chart.Tooltip cursor={false} content={<Ui.Chart.TooltipContent hideLabel nameKey={nameKey} />} />
          <Recharts.Bar dataKey={dataKey} layout='vertical' radius={5} />
        </Recharts.BarChart>
      </Ui.Chart.Container>
    </div>
  )
})
