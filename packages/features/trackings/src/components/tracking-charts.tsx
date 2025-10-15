import { useToday } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { cxm, match } from "@compo/utils"
import { download, generateCsv, mkConfig } from "export-to-csv"
import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import React from "react"
import { v4 } from "uuid"
import { ChartData, ChartTypeName, DisplayByName, StatsInterval, StatsName, StatsProps } from "../types"
import { intervalFromDisplayBy } from "../utils"
import { BrowserChart } from "./browser"
import { DayChart } from "./day"
import { DeviceChart } from "./device"
import { DownloadChart } from "./download-chart"
import { HourChart } from "./hour"
import { MonthChart } from "./month"
import { OsChart } from "./os"
import { SelectChartType } from "./select-chart"
import { SelectDisplayBy } from "./select-display-by"
import { SelectInterval } from "./select-interval"
import { SelectStats } from "./select-stats"
import { WeekChart } from "./week"
import { YearChart } from "./year"

/**
 * TrackingCharts
 */
export type TrackingChartsProps = {
  trackingId?: string
  trackings?: string[]
  title?: string
  titleLevel?: number
  refreshInterval?: number
  defaultDisplayBy?: DisplayByName
  defaultChartType?: ChartTypeName
  defaultStats?: StatsName
  display?: StatsProps["display"]
  label?: string
  classNames?: {
    wrapper?: string
    header?: string
    title?: string
    aside?: string
  }
} & React.ComponentProps<"div">
export const TrackingCharts: React.FC<TrackingChartsProps> = ({
  trackingId,
  trackings,
  title,
  titleLevel = 2,
  refreshInterval = 5000,
  defaultDisplayBy = "days",
  defaultChartType = "donut",
  defaultStats = "visit",
  display = "visits",
  label = "Visites",
  className,
  classNames,
  children,
  ...props
}) => {
  // initial navigation states
  const [displayBy, setDisplayBy] = React.useState<DisplayByName>(() => defaultDisplayBy)
  const [chartType, setChartType] = React.useState<ChartTypeName>(() => defaultChartType)
  const [stats, setStats] = React.useState<StatsName>(() => defaultStats)

  // interval from range
  const today = useToday()
  const [interval, setInterval] = React.useState<StatsInterval>(() => intervalFromDisplayBy(displayBy, today))

  const [chartDataChange, setChartDataChange] = React.useState<ChartData<unknown>>([])
  const chartProps = React.useMemo(
    () => ({
      trackingId,
      trackings,
      interval,
      refreshInterval,
      chartType,
      stats,
      display,
      label,
      onChartDataChange: setChartDataChange,
    }),
    [trackingId, trackings, interval, refreshInterval, chartType, stats, display, label]
  )

  const ref = React.useRef<HTMLDivElement>(null)
  const onDownloadAsImage = async () => {
    if (ref.current) {
      const svg = ref.current.querySelector("svg")
      if (!svg) return
      html2canvas(ref.current).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, "chart.png")
          }
        })
      })
    }
  }
  const onDownloadAsCsv = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `chart-${v4()}.csv`,
    })
    const csvData = generateCsv(csvConfig)(chartDataChange)
    download(csvConfig)(csvData)
  }
  return (
    <div className={cxm("@container space-y-2", classNames?.wrapper, className)} {...props}>
      <div
        className={cxm(
          "bg-card/90 sticky top-[var(--dialog-header-height)] z-10 space-y-4 backdrop-blur-[2px] @2xl:flex @2xl:items-center @2xl:justify-between @2xl:gap-4 @2xl:space-y-0",
          classNames?.header
        )}
      >
        {children || (
          <Ui.Hn level={titleLevel} className={cxm("text-lg/none font-normal", classNames?.title)}>
            {title}
          </Ui.Hn>
        )}
        <div className={cxm("flex justify-end gap-4", classNames?.aside)}>
          <SelectStats stats={stats} setStats={setStats} display={display} />
          {match(stats)
            .with("visit", () => (
              <SelectDisplayBy
                displayBy={displayBy}
                setDisplayBy={(v) => {
                  setDisplayBy(v)
                  setInterval(intervalFromDisplayBy(v, interval.to ?? today))
                }}
              />
            ))
            .with("os", "browser", "device", () => (
              <SelectChartType chartType={chartType} setChartType={setChartType} />
            ))
            .exhaustive()}
        </div>
      </div>
      <div className='flex aspect-video w-full flex-col'>
        {match(stats)
          .with("visit", () =>
            match(displayBy)
              .with("hours", () => <HourChart {...chartProps} ref={ref} />)
              .with("days", () => <DayChart {...chartProps} ref={ref} />)
              .with("weeks", () => <WeekChart {...chartProps} ref={ref} />)
              .with("months", () => <MonthChart {...chartProps} ref={ref} />)
              .with("years", () => <YearChart {...chartProps} ref={ref} />)
              .exhaustive()
          )
          .with("os", () => <OsChart {...chartProps} ref={ref} />)
          .with("browser", () => <BrowserChart {...chartProps} ref={ref} />)
          .with("device", () => <DeviceChart {...chartProps} ref={ref} />)
          .exhaustive()}
      </div>
      <div className='bg-card/90 sticky bottom-0 z-10 flex justify-between gap-4 py-4 backdrop-blur-[2px]'>
        <DownloadChart onDownloadAsImage={onDownloadAsImage} onDownloadAsCsv={onDownloadAsCsv} />
        <div className='flex items-center justify-end gap-4'>
          <SelectInterval displayBy={displayBy} interval={interval} setInterval={setInterval} />
        </div>
      </div>
    </div>
  )
}
