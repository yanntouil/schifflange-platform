import { CookieApp, useCookies } from "@/components/cookies"
import React from "react"

/**
 * usePersistedState
 */
export const usePersistedState = <T>(
  defaultValue: T,
  key: string,
  app: CookieApp,
  storage: typeof localStorage | typeof sessionStorage = localStorage
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const { canUse } = useCookies()
  const [state, setState] = React.useState(() => {
    if (typeof storage === "object" && canUse(app)) {
      const storeValue = storage.getItem(key)
      if (storeValue) {
        try {
          const storeState = JSON.parse(storeValue) as T
          return storeState
        } catch (e) {
          console.error(e)
        }
      }
    }
    return defaultValue
  })
  React.useEffect(() => {
    if (typeof storage === "object") storage.setItem(key, JSON.stringify(state))
  }, [key, state, storage])
  return [state, setState]
}
