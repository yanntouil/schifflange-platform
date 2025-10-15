import React from "react"

type UseTimeoutFn = () => void

export const useTimeout = (callback: UseTimeoutFn, delay: number | null) => {
  const savedCallback = React.useRef<UseTimeoutFn>(callback)

  // Save the latest callback
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    if (delay === null) return

    const handler = () => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    const timeoutId = setTimeout(handler, delay)

    return () => clearTimeout(timeoutId)
  }, [delay])
}
