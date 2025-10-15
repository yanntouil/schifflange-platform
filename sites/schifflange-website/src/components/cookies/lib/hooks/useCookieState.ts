"use client"

import { D, G } from "@compo/utils"
import React from "react"
import { storage } from "../fns/storage"

/**
 * useCookieState
 *
 * A custom hook that manages state synchronized with a cookie.
 *
 * @param defaultValue - The default value to use if the cookie is not set.
 * @param key - The key of the cookie to synchronize with.
 * @returns A secure stateful value, and a function to update it.
 */
export function useCookieState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state with the value from the cookie, or the default value if the cookie is not set.
  const [state, setState] = React.useState(() => {
    const storeValue = storage.cookie.get(key)
    return mergeValues(defaultValue, typeof storeValue === "string" ? storeValue : null)
  })

  // Update the cookie whenever the state changes.
  React.useEffect(() => {
    storage.cookie.set(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

/**
 * mergeValues
 *
 * Safe merges the default value with the store value.
 *
 * @param defaultValue - The default value to use if the cookie is not set.
 * @param storeValue - The value from the cookie to merge with the default value.
 */
const mergeValues = <T>(defaultValue: T, storeValue?: string | null): T => {
  // Guard clauses – nothing usable to parse
  if (storeValue == null || storeValue === "" || storeValue === "undefined" || storeValue === "null") {
    return defaultValue
  }

  try {
    // If you encode cookie values, uncomment next line:
    // const raw = decodeURIComponent(storeValue)
    const raw = storeValue
    const storeState = JSON.parse(raw)

    // Merge only when both sides are plain objects
    if (G.isObject(storeState) && G.isObject(defaultValue)) {
      return D.mapWithKey(defaultValue, (k, fromDefault) => {
        const fromStore = D.get(storeState, k) ?? fromDefault
        return typeof fromStore === typeof fromDefault ? fromStore : fromDefault
      }) as T
    }

    // Same primitive type? take stored value
    if (typeof storeState === typeof defaultValue) {
      return storeState as T
    }
  } catch (e) {
    // Keep quiet in production, or log once if you need diagnostics
    // console.warn("[mergeValues] parse failed:", e)
  }
  return defaultValue
}
