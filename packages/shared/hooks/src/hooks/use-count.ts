import { N, millify } from "@compo/utils"
import React from "react"
import { useCountUp } from "use-count-up"

/**
 * useCount
 * Count up a value
 */
export const useCount = (
  value: number,
  precision: number = 1,
  round: boolean = true,
  durationFactor: number = 0.325
) => {
  return useCountUp({
    isCounting: React.useMemo(() => value > 0, [value]),
    end: value,
    duration: N.clamp(Math.round(value * durationFactor), 0, 5),
    formatter: (v) => millify(round ? Math.round(v) : v, { precision: clampPrecision(v, precision) }),
  }).value
}

/**
 * clampPrecision
 * Clamp the precision of the value for millify
 */
const clampPrecision = (value: number, precision: number) => {
  const length = Math.floor(value).toString().length
  return Math.min(precision, length - 1)
}
