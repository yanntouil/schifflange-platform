import { G } from "@compo/utils"
import { useMediaIsInRange, useMediaIsMax, useMediaIsMin } from "./use-media"

/**
 * useByRow
 */
export const useByRow = (params: Partial<Breakpoints>) => {
  const medias = {
    sm: useMediaIsMax("sm"),
    md: useMediaIsInRange("sm", "md"),
    lg: useMediaIsInRange("md", "lg"),
    xl: useMediaIsInRange("lg", "xl"),
    "2xl": useMediaIsInRange("xl", "2xl"),
    "2xl+": useMediaIsMin("2xl"),
  }
  const byRow = medias.sm
    ? breakpointOrGt("sm", params)
    : medias.md
    ? breakpointOrGt("md", params)
    : medias.lg
    ? breakpointOrGt("lg", params)
    : medias.xl
    ? breakpointOrGt("xl", params)
    : medias["2xl"]
    ? breakpointOrGt("2xl", params)
    : medias["2xl+"]
    ? breakpointOrGt("2xl+", params)
    : 0
  return [byRow, medias] as const
}

type Breakpoints = { sm: number; md: number; lg: number; xl: number; "2xl": number; "2xl+": number }
const breakpointsValues: Partial<Breakpoints> = {
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined,
  "2xl": undefined,
  "2xl+": undefined,
}

/**
 * return breakpoint value or first greater value set in params
 */
const breakpointOrGt = (breakpoint: keyof Breakpoints, breakpoints: Partial<Breakpoints>) => {
  const current = breakpoints[breakpoint]
  if (G.isNotNullable(current)) return current
  const merged = { ...breakpointsValues, ...breakpoints }
  const sortedBP = [merged.sm, merged.md, merged.lg, merged.xl, merged["2xl"], merged["2xl+"]]
  for (let i = sortedBP.findIndex((value) => value === breakpoints[breakpoint]); i < sortedBP.length; i++) {
    const value = sortedBP[i]
    if (G.isNotNullable(value)) return value
  }
  return 0
}

/**
 * return number of columns to display
 */
export const colsToDisplay = (byRow: number, minDisplayed: number) =>
  Math.ceil(Math.max(minDisplayed ?? 0, byRow) / byRow)
