import { ZodSchema } from "@compo/utils"
import React from "react"

/**
 * usePersistedState
 */
export const usePersistedState = <T>(
  defaultValue: T,
  key: string,
  schema?: ZodSchema<T>,
  storage: Storage = sessionStorage
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(() => {
    if (typeof storage === "object") {
      const storeValue = storage.getItem(key)
      if (storeValue) {
        try {
          const parsedValue = JSON.parse(storeValue)
          if (schema) return schema.parse(parsedValue)
          return parsedValue
        } catch (e) {
          return defaultValue
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
