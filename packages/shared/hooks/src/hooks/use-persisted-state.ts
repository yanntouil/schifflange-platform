import React from "react"
import { ZodSchema } from "zod"

/**
 * usePersistedState
 */
export const usePersistedState = <T>(
  defaultValue: T,
  key: string,
  schema?: ZodSchema<T>,
  storage?: Storage
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(() => getItem(defaultValue, key, schema, storage))
  React.useEffect(() => {
    if (typeof storage === "object" && state !== getItem(defaultValue, key, schema, storage)) {
      storage.setItem(key, JSON.stringify(state))
    }
  }, [key, state, storage, defaultValue, schema])
  return [state, setState]
}

/**
 * getItem
 * this function is used to get the item from the storage
 * @param defaultValue - the default value to use if the item is not found
 * @param key - the key of the item
 * @param schema - the schema to use to parse the item
 * @param storage - the storage to use to get the item
 * @returns the item
 */
const getItem = <T>(defaultValue: T, key: string, schema?: ZodSchema<T>, storage?: Storage) => {
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
}
