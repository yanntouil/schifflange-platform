import React from "react"

/**
 * useIsSticky
 * Detect if tabs are currently sticky (sticking to top)
 */
export const useIsSticky = <T extends HTMLElement>(sentinelRef: React.RefObject<T>) => {
  const [isSticky, setIsSticky] = React.useState(false)

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible, tabs are sticky
        setIsSticky(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  return isSticky
}
