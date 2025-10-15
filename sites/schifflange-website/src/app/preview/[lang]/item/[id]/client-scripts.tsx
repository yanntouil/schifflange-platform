"use client"

import React from "react"

/**
 * PreviewWrapper
 * Wrapper component that handles height communication with parent iframe
 */

interface PreviewWrapperProps {
  itemId: string
  children: React.ReactNode
}

export function PreviewWrapper({ itemId, children }: PreviewWrapperProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sendHeight = () => {
      if (window.parent !== window && container) {
        const height = container.scrollHeight

        window.parent.postMessage(
          {
            type: "preview-resize",
            itemId,
            height,
          },
          "*"
        )
      }
    }

    // Setup ResizeObserver to watch for height changes
    const resizeObserver = new ResizeObserver(() => {
      sendHeight()
    })

    // Setup MutationObserver to catch DOM changes
    const mutationObserver = new MutationObserver(() => {
      // Small delay to let DOM updates complete
      setTimeout(sendHeight, 10)
    })

    // Start observing
    resizeObserver.observe(container)
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })

    // Send initial height
    const sendInitialHeight = () => {
      sendHeight()
      // Additional attempts for image loading
      setTimeout(sendHeight, 100)
      setTimeout(sendHeight, 300)
      setTimeout(sendHeight, 1000)
    }

    sendInitialHeight()

    // Listen for image loads within the container
    const handleImageLoad = () => sendHeight()
    const images = container.querySelectorAll("img")
    images.forEach((img) => {
      if (img.complete) {
        sendHeight()
      } else {
        img.addEventListener("load", handleImageLoad)
        img.addEventListener("error", handleImageLoad) // Even on error, size might change
      }
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad)
        img.removeEventListener("error", handleImageLoad)
      })
    }
  }, [itemId])

  return (
    <div ref={containerRef} className='preview-container'>
      {children}
    </div>
  )
}

// Note: useRefreshOnUpdate is commented out in the page since SSE refresh is disabled
// Uncomment and import necessary dependencies if you want to use it
