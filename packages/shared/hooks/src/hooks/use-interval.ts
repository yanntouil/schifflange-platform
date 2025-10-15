import React from "react"

/**
 * useInterval
 * @description
 * This hook is used to execute a function every ms milliseconds
 * @param ms - The interval in milliseconds
 * @returns void
 */
export const useInterval = (callback: () => void, ms: number) => {
  React.useEffect(() => {
    const interval = setInterval(callback, ms)
    return () => clearInterval(interval)
  }, [callback, ms])
}
