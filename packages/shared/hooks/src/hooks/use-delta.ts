import React from "react"

/**
 * Returns delta of value changes
 */

export const useDeltaValue = (value: number, initialValue: number = 0): number => {
  const lastValue = React.useRef(initialValue)
  const [delta, setDelta] = React.useState(() => value - lastValue.current)

  React.useEffect(() => {
    setDelta(value - lastValue.current)
    lastValue.current = value
  }, [value])

  return delta
}
