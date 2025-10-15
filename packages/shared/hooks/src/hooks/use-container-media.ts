import React from "react"

/**
 * useContainerSize
 * return the size of the container
 */
export const useContainerSize = (
  containerRef: React.RefObject<HTMLElement> | null
): { width: number; height: number } => {
  const [size, setSize] = React.useState<{ width: number; height: number }>(() => getSizeFromContainer(containerRef))

  React.useEffect(() => {
    if (!isBrowser() || !containerRef?.current) return

    const handler = () => setSize(getSizeFromContainer(containerRef))
    const resizeObserver = new ResizeObserver(handler)

    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [containerRef])

  return size
}

/**
 * useContainerMedia
 * return true if the container matches the query
 */
export const useContainerMedia = (query: string, containerRef: React.RefObject<HTMLElement> | null): boolean => {
  const [matches, setMatches] = React.useState<boolean>(() => matchesQueryFromContainer(containerRef, query))

  React.useEffect(() => {
    if (!isBrowser() || !containerRef?.current) return

    const handler = () => setMatches(matchesQueryFromContainer(containerRef, query))
    const resizeObserver = new ResizeObserver(handler)

    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [containerRef, query])

  return matches
}

/**
 * Shorthand for container queries
 * compatible with tailwindcss-container-queries
 * https://github.com/tailwindlabs/tailwindcss-container-queries
 */
const containerMedia = {
  min: {
    xs: "(min-width: 20rem)",
    sm: "(min-width: 24rem)",
    md: "(min-width: 28rem)",
    lg: "(min-width: 32rem)",
    xl: "(min-width: 36rem)",
    "2xl": "(min-width: 42rem)",
    "3xl": "(min-width: 48rem)",
    "4xl": "(min-width: 56rem)",
    "5xl": "(min-width: 64rem)",
    "6xl": "(min-width: 72rem)",
    "7xl": "(min-width: 80rem)",
  },
  max: {
    xs: "(max-width: 20rem)",
    sm: "(max-width: 24rem)",
    md: "(max-width: 28rem)",
    lg: "(max-width: 32rem)",
    xl: "(max-width: 36rem)",
    "2xl": "(max-width: 42rem)",
    "3xl": "(max-width: 48rem)",
    "4xl": "(max-width: 56rem)",
    "5xl": "(max-width: 64rem)",
    "6xl": "(max-width: 72rem)",
    "7xl": "(max-width: 80rem)",
  },
}

/**
 * By container
 */
export type ContainerMediaBreakpoint = keyof (typeof containerMedia)["min"] & keyof (typeof containerMedia)["max"]

export const useIsMinByContainer = (
  breakpoint: keyof (typeof containerMedia)["min"],
  containerRef: React.RefObject<HTMLElement> | null
) => useContainerMedia(containerMedia.min[breakpoint], containerRef)

export const useIsMaxByContainer = (
  breakpoint: keyof (typeof containerMedia)["max"],
  containerRef: React.RefObject<HTMLElement> | null
) => useContainerMedia(containerMedia.max[breakpoint], containerRef)

export const useIsInRangeByContainer = (
  min: keyof (typeof containerMedia)["min"],
  max: keyof (typeof containerMedia)["max"],
  containerRef: React.RefObject<HTMLElement> | null
) => useContainerMedia(`${containerMedia.min[min]} and ${containerMedia.max[max]}`, containerRef)

/**
 * By width
 */
export const isMinBreakpoint = (breakpoint: keyof (typeof containerMedia)["min"], width: number) => {
  const query = containerMedia.min[breakpoint]
  const matches = matchesQueryFromWidth(width, query)
  return matches
}

export const isMaxBreakpoint = (breakpoint: keyof (typeof containerMedia)["max"], width: number) =>
  matchesQueryFromWidth(width, containerMedia.max[breakpoint])

export const isInRangeBreakpoint = (
  min: keyof (typeof containerMedia)["min"],
  max: keyof (typeof containerMedia)["max"],
  width: number
) => matchesQueryFromWidth(width, `${containerMedia.min[min]} and ${containerMedia.max[max]}`)

export const getContainerMedias = (width: number) => {
  return {
    xs: isMaxBreakpoint("xs", width),
    sm: isInRangeBreakpoint("xs", "sm", width),
    md: isInRangeBreakpoint("sm", "md", width),
    lg: isInRangeBreakpoint("md", "lg", width),
    xl: isInRangeBreakpoint("lg", "xl", width),
    "2xl": isInRangeBreakpoint("xl", "2xl", width),
    "3xl": isInRangeBreakpoint("2xl", "3xl", width),
    "4xl": isInRangeBreakpoint("3xl", "4xl", width),
    "5xl": isInRangeBreakpoint("4xl", "5xl", width),
    "6xl": isInRangeBreakpoint("5xl", "6xl", width),
    "7xl": isInRangeBreakpoint("6xl", "7xl", width),
    "7xl+": isMinBreakpoint("7xl", width),
  }
}
export const getContainerMedia = (width: number) => {
  const medias = getContainerMedias(width)
  return Object.keys(medias).find((key) => medias[key as keyof typeof medias])
}

/**
 * helpers
 */
const matchesQueryFromContainer = (containerRef: React.RefObject<HTMLElement> | null, query: string): boolean => {
  if (!isBrowser() || !containerRef?.current) return false
  return matchesByWidth(getSizeFromContainer(containerRef).width, query)
}

const matchesQueryFromWidth = (width: number, query: string): boolean => {
  if (!isBrowser()) return false
  return matchesByWidth(width, query)
}

const minPxFromQuery = (query: string): number => {
  const inRem = query.match(/min-width:\s*(\d+)rem/)?.[1]
  if (inRem) return +inRem * 16
  const inPx = query.match(/min-width:\s*(\d+)px/)?.[1]
  if (inPx) return +inPx
  return 0
}

const maxPxFromQuery = (query: string): number => {
  const inRem = query.match(/max-width:\s*(\d+)rem/)?.[1]
  if (inRem) return +inRem * 16
  const inPx = query.match(/max-width:\s*(\d+)px/)?.[1]
  if (inPx) return +inPx
  return Infinity
}

const matchesByWidth = (width: number, query: string): boolean => {
  return width >= minPxFromQuery(query) && width <= maxPxFromQuery(query)
}

const isBrowser = () => typeof window !== "undefined"

const getSizeFromContainer = (containerRef: React.RefObject<HTMLElement> | null): { width: number; height: number } => {
  if (!isBrowser() || !containerRef?.current) return { width: 0, height: 0 }
  return { width: containerRef.current.clientWidth, height: containerRef.current.clientHeight }
}
