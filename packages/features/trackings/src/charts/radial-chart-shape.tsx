import { Recharts, Ui } from "@compo/ui"
import React from "react"
import { ChartData } from "../types"

/**
/**
 * RadialChartShape
 */
export const RadialChartShape = React.forwardRef<
  HTMLDivElement,
  {
    chartData: ChartData<{ fill: string }>
    chartConfig: Ui.ChartConfig
    nameKey: string
    dataKey: string
    labelKey: string
  }
>(({ chartData, chartConfig, nameKey, dataKey, labelKey }, ref) => {
  return (
    <Ui.Chart.Container config={chartConfig} className='m-auto aspect-square h-full' ref={ref}>
      <Recharts.RadialBarChart data={chartData} startAngle={-90} endAngle={380} innerRadius={50} outerRadius={160}>
        <Ui.Chart.Tooltip cursor={false} content={<Ui.Chart.TooltipContent hideLabel nameKey={nameKey} />} />
        <Recharts.RadialBar dataKey={dataKey} background>
          <Recharts.LabelList
            position='insideStart'
            dataKey={labelKey}
            className='fill-white capitalize mix-blend-luminosity'
            fontSize={11}
          />
        </Recharts.RadialBar>
      </Recharts.RadialBarChart>
    </Ui.Chart.Container>
  )
})
