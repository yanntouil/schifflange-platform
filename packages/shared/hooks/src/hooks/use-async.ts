import React from "react"
import { useEffectOnce } from "./use-effect-once"

/**
 * useAsyncOnce
 */
export const useAsyncOnce = <T>(asyncFn: () => Promise<T>, cleanup: () => void = () => {}) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<T | null>(null)

  const handle = async () => {
    setIsLoading(true)
    setError(null) // Reset error state on re-run
    try {
      const result = await asyncFn()
      setData(result)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffectOnce(() => {
    handle()
    return cleanup
  })

  return { isLoading, error, data }
}
