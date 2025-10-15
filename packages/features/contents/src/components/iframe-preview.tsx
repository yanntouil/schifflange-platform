import { Icon } from "@compo/ui"
import type { Api } from "@services/dashboard"
import React from "react"

/**
 * IframePreview
 * Display the iframe preview with dynamic height adjustment
 */
export const IframePreview: React.FC<{
  item: Api.ContentItem
  locale: string
  makePreviewUrl: (item: Api.ContentItem, locale: string) => string
  showDebug?: boolean
  className?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}> = ({ item, locale, makePreviewUrl, showDebug = false, className = "", onLoad, onError }) => {
  const baseUrl = makePreviewUrl(item, locale)

  // Counter that increments only when item changes
  const [refreshCounter, setRefreshCounter] = React.useState(0)
  const prevItemRef = React.useRef<Api.ContentItem | null>(null)

  React.useEffect(() => {
    if (prevItemRef.current && prevItemRef.current !== item) {
      setRefreshCounter((prev) => prev + 1)
    }
    prevItemRef.current = item
  }, [item])

  // Add cache-busting parameter to force refresh on every change
  const url = React.useMemo(() => {
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}_v=${refreshCounter}`
  }, [baseUrl, refreshCounter])

  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = React.useState<number>(400) // Default height
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Listen for height updates from iframe
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin if needed
      // if (event.origin !== expectedOrigin) return

      if (event.data?.type === "preview-resize" && event.data?.itemId === item.id) {
        const newHeight = event.data.height
        if (typeof newHeight === "number" && newHeight > 0) {
          setHeight(newHeight)
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [item.id])

  // Force refresh when URL changes (including cache-busting parameter)
  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url
      setIsLoading(true)
      setError(null)
    }
  }, [url])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
    onLoad?.()
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError("Failed to load preview")
    onError?.(new Error("Failed to load preview"))
  }

  return (
    <div className={`relative ${className}`}>
      {showDebug && (
        <div className='mb-2 rounded bg-gray-100 p-2'>
          <code className='text-xs'>{url}</code>
          <div className='mt-1 text-xs text-gray-600'>
            Height: {height}px | Status: {isLoading ? "Loading..." : error || "Ready"}
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className='absolute right-2 top-2 z-10'>
          <Icon.Loader variant='round' className='size-5 text-slate-600' aria-hidden />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-red-50'>
          <div className='text-center'>
            <p className='text-sm text-red-600'>{error}</p>
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = url
                  setIsLoading(true)
                  setError(null)
                }
              }}
              className='mt-2 text-sm text-blue-600 hover:underline'
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        className='w-full border-0'
        style={{ height: `${height}px`, minHeight: "200px" }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={`Preview of ${item.type}`}
        sandbox='allow-scripts allow-same-origin'
      />
    </div>
  )
}
