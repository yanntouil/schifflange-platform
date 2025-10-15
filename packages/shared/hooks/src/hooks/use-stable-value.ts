import React from "react"

/**
 * useStableValue
 * @description
 * This hook is used to ensure that a value is stable and does not change after initialization
 * @param value - The value to ensure is stable
 * @returns The stable value
 */
export const useStableValue = <V>(value: V) => {
  const [initValue] = React.useState(() => value)
  if (value !== initValue) throw new Error("useStableValue: Stable value changed after initialization")
  return value
}
