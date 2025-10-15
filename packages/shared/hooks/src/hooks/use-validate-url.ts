import { isUrlValid } from "@compo/utils"
import { encode } from "qss"
import React from "react"

/**
/**
 * useValidateUrl
 */
export const useValidateUrl = (url: string, apiPathToProxy: string) => {
  const [isValid, setIsValid] = React.useState<boolean | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const validateUrl = async () => {
      try {
        setIsLoading(true)
        setIsValid(null)
        const response = await fetch(`${apiPathToProxy}?${encode({ url })}`, {
          method: "HEAD",
          signal,
        })
        setIsValid(response.ok)
      } catch (err) {
        if (signal.aborted) return
        setIsValid(false)
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }
    if (isUrlValid(url)) {
      validateUrl()
    } else setIsValid(false)
    return () => {
      controller.abort() // Cancel the fetch if the component is unmounted or the URL changes
    }
  }, [url])

  return { isValid, isLoading }
}
