import React from "react"

/**
 * This hook is used to handle the loading state of a promise.
 * It returns a tuple of the promise and the loading state.
 * The promise is a function that returns a promise.
 * The loading state is a boolean.
 */
export const usePromiseLoading = <T>(fn: () => Promise<T>) => {
  const [loading, setLoading] = React.useState(false)
  const promise = async () => {
    setLoading(true)
    const result = await fn()
    setLoading(false)
    return result
  }
  return [promise, loading] as const
}
