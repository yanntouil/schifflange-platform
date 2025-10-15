import React from "react"

/**
 * useIsFirstRender
 * Simple React hook that return a boolean,
 * true at the mount time, then always false
 */
export const useIsFirstRender = (): boolean => {
  const isFirst = React.useRef(true)
  if (isFirst.current) {
    isFirst.current = false
    return true
  }
  return isFirst.current
}
