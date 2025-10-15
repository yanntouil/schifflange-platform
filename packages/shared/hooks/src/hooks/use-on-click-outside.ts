import React from "react"

/**
 * useOnClickOutside
 * Detect if click is outside of the element
 */
export const useOnClickOutside = <T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
) => {
  React.useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = containerRef?.current
      if (!el || el.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [containerRef, handler, enabled])
}
