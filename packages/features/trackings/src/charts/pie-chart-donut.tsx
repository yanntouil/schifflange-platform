import { Recharts, Ui } from "@compo/ui"
import { A, millify } from "@compo/utils"
import React from "react"
import { ChartData } from "../types"

/**
 * PieChartDonut
 */
export const PieChartDonut = React.forwardRef<
  HTMLDivElement,
  {
    chartData: ChartData<{ fill: string }>
    chartConfig: Ui.ChartConfig
    nameKey: string
    dataKey: string
    labelKey: string
  }
>(({ chartData, chartConfig, nameKey, dataKey, labelKey }, ref) => {
  const totalViews = React.useMemo(
    () => A.reduce(chartData, 0, (acc, stat) => acc + Number(stat?.[dataKey] ?? 0)),
    [chartData, dataKey]
  )
  return (
    <Ui.Chart.Container config={chartConfig} className='m-auto h-full' ref={ref}>
      <Recharts.PieChart>
        <Ui.Chart.Tooltip
          cursor={false}
          content={
            <Ui.Chart.TooltipContent
              hideLabel
              nameKey={nameKey}
              valueFormatter={(value) =>
                `${((Number(value) / totalViews) * 100).toFixed(2)}% (${millify(Number(value))})`
              }
            />
          }
        />
        <Recharts.Pie data={chartData} dataKey={dataKey} nameKey={labelKey} innerRadius={80}>
          <Recharts.Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                    <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
                      {millify(totalViews)}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
                      Clicks
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Recharts.Pie>
        <Ui.Chart.Legend content={<Ui.Chart.LegendContent nameKey={labelKey} />} />
      </Recharts.PieChart>
    </Ui.Chart.Container>
  )
})
