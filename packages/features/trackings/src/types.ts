/**
 * StatsProps
 * Props for the Stats component
 */
export type StatsProps = {
  trackingId?: string
  trackings?: string[]
  interval: StatsInterval
  refreshInterval?: number
  label?: string
  display?: "views" | "clicks" | "visits"
  onChartDataChange?: (record: ChartData<unknown>) => void
}

/**
 * StatsInterval
 * Interval for the stats
 */
export type StatsInterval = {
  from: Date | undefined
  to: Date | undefined
}

/**
 * StatRecord
 * Record for the stats
 */
export type StatRecord = {
  name: string
  value: number
}

/**
 * RangeName
 * Range for the stats
 */
export type RangeName = "7days" | "1month" | "3months" | "6months" | "12months" | "all"

/**
 * DisplayByName
 * Display for the stats
 */
export type DisplayByName = "hours" | "days" | "weeks" | "months" | "years"

/**
 * ChartTypeName
 * Type for the chart
 */
export type ChartTypeName = "donut" | "bar" | "radial"

/**
 * StatsName
 * Name for the stats
 */
export type StatsName = "visit" | "os" | "browser" | "device"

/**
 * ChartData
 * Data for the chart
 */
export type ChartData<T = {}> = (Record<string, string | number> & T)[]
