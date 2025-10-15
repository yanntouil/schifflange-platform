import React from "react"

/**
 * useMedia
 * return true if the media query matches
 */
export const useMedia = (query: string): boolean => {
  // state containing the current state of the media query
  const [matches, setMatches] = React.useState<boolean>(() => getMatches(query))

  React.useEffect(() => {
    if (!isBrowser()) return

    const handler = () => setMatches(getMatches(query))
    const matchMedia = window.matchMedia(query)

    // Triggered at the first client-side load and if query changes
    handler()

    // Listen matchMedia
    matchMedia.addEventListener("change", handler)

    return () => {
      matchMedia.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}

/**
 * Shorthand for media queries
 * compatible with tailwindcss responsive-design
 * https://tailwindcss.com/docs/responsive-design
 */
const media = {
  min: {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  },
  max: {
    sm: "(max-width: 640px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
    xl: "(max-width: 1280px)",
    "2xl": "(max-width: 1536px)",
  },
}
export type MediaBreakpoint = keyof (typeof media)["min"] & keyof (typeof media)["max"]
export const useMediaIsMin = (breakpoint: keyof (typeof media)["min"]) => useMedia(media.min[breakpoint])
export const useMediaIsMax = (breakpoint: keyof (typeof media)["max"]) => useMedia(media.max[breakpoint])
export const useMediaIsInRange = (min: keyof (typeof media)["min"], max: keyof (typeof media)["max"]) =>
  useMedia(`${media.min[min]} and ${media.max[max]}`)
export const useMediaIsMobile = () => useMedia("(max-width: 640px)")
export const useMediaIsWide = () => !useMediaIsMobile()

/**
 * helpers
 */
const isBrowser = () => typeof window !== "undefined"
const getMatches = (query: string): boolean => {
  // Prevents SSR issues
  if (isBrowser()) return window.matchMedia(query).matches
  return false
}
