import * as React from "react"

// Format: { THEME_NAME: CSS_SELECTOR }
export const THEMES = { light: "", dark: ".dark" } as const

/**
 * types
 */
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}
export type ChartContextProps = {
  config: ChartConfig
}

/**
 * context
 */
export const ChartContext = React.createContext<ChartContextProps | null>(null)

/**
 * hooks
 */
export const useChart = () => {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}
