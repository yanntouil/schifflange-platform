import { F } from "@compo/utils"
import React from "react"
import { useEventListener } from "./use-event-listener"

/**
 * Easily retrieve window dimensions with this Hook React which also works onRezise
 */
export const useWindowSize = (onResize: (size: WindowSize) => void = F.ignore): WindowSize => {
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const handleSize = () => {
    onResize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener("resize", handleSize)

  // Set size at the first client-side load
  React.useLayoutEffect(() => {
    handleSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return windowSize
}

/**
 * types
 */
export interface WindowSize {
  width: number
  height: number
}
