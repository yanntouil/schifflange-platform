import { A, D, G } from "@compo/utils"
import React from "react"
import { getContainerMedias, useContainerSize } from "./use-container-media"

/**
 * rowInWidth
 * - xs:  max 20rem (320px)
 * - sm:  between 20rem (320px) and 24rem (384px)
 * - md:  between 24rem (384px) and 28rem (448px)
 * - lg:  between 28rem (448px) and 32rem (512px)
 * - xl:  between 32rem (512px) and 36rem (576px)
 * - 2xl: between 36rem (576px) and 42rem (640px)
 * - 3xl: between 42rem (640px) and 48rem (704px)
 * - 4xl: between 56rem (704px) and 64rem (768px)
 * - 5xl: between 64rem (704px) and 72rem (768px)
 * - 6xl: between 72rem (864px) and 80rem (896px)
 * - 7xl: between 80rem (896px) and 88rem (928px)
 */
export const rowInWidth = (params: Partial<Breakpoints>, width: number) => {
  const medias = getContainerMedias(width)

  const byRow = medias.xs
    ? getbreakpointValue("xs", params)
    : medias.sm
      ? getbreakpointValue("sm", params)
      : medias.md
        ? getbreakpointValue("md", params)
        : medias.lg
          ? getbreakpointValue("lg", params)
          : medias.xl
            ? getbreakpointValue("xl", params)
            : medias["2xl"]
              ? getbreakpointValue("2xl", params)
              : medias["3xl"]
                ? getbreakpointValue("3xl", params)
                : medias["4xl"]
                  ? getbreakpointValue("4xl", params)
                  : medias["5xl"]
                    ? getbreakpointValue("5xl", params)
                    : medias["6xl"]
                      ? getbreakpointValue("6xl", params)
                      : medias["7xl"]
                        ? getbreakpointValue("7xl", params)
                        : medias["7xl+"]
                          ? getbreakpointValue("7xl+", params)
                          : 0

  return [byRow, medias, width] as const
}

/**
 * useByRow
 * - xs:  max 20rem (320px)
 * - sm:  between 20rem (320px) and 24rem (384px)
 * - md:  between 24rem (384px) and 28rem (448px)
 * - lg:  between 28rem (448px) and 32rem (512px)
 * - xl:  between 32rem (512px) and 36rem (576px)
 * - 2xl: between 36rem (576px) and 42rem (640px)
 * - 3xl: between 42rem (640px) and 48rem (704px)
 * - 4xl: between 56rem (704px) and 64rem (768px)
 * - 5xl: between 64rem (704px) and 72rem (768px)
 * - 6xl: between 72rem (864px) and 80rem (896px)
 * - 7xl: between 80rem (896px) and 88rem (928px)
 */
export const useByRow = (params: Partial<Breakpoints>, containerRef: React.RefObject<HTMLElement> | null) => {
  const { width } = useContainerSize(containerRef)
  return rowInWidth(params, width)
}

/**
 * getbreakpointValue
 */
const getbreakpointValue = (breakpoint: keyof Breakpoints, breakpoints: Partial<Breakpoints>) => {
  // prettier-ignore
  const breakpointOrder: (keyof Breakpoints)[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "7xl+"]
  const startIndex = breakpointOrder.indexOf(breakpoint)
  for (let i = startIndex; i >= 0; i--) {
    const bp = A.get(breakpointOrder, i)
    if (G.isNullable(bp)) continue
    const current = D.get(breakpoints, bp)
    if (G.isNullable(current)) continue
    return current
  }
  return 0
}

/**
 * types
 */
type Breakpoints = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
  "3xl": number
  "4xl": number
  "5xl": number
  "6xl": number
  "7xl": number
  "7xl+": number
}
