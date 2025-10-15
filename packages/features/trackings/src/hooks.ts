import { useCountUp } from "@compo/hooks"
import { D, G, N, millify } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useTrackingService } from "./context"

type TrackingMethods = Pick<
  Api.TrackingService,
  "stats" | "byHour" | "byDay" | "byWeek" | "byMonth" | "byYear" | "byBrowser" | "byDevice" | "byOs"
>

/**
 * useTrackings
 * Get a prepared service for trackings
 */
export const useTrackings = ({ trackings, trackingId }: { trackings?: string[]; trackingId?: string }): TrackingMethods => {
  const service = useTrackingService()

  const preparedService = G.isArray(trackings)
    ? service.trackings(trackings)
    : G.isString(trackingId)
      ? service.tracking(trackingId)
      : service

  return D.selectKeys(preparedService, [
    "stats",
    "byHour",
    "byDay",
    "byWeek",
    "byMonth",
    "byYear",
    "byBrowser",
    "byDevice",
    "byOs",
  ]) as TrackingMethods
}

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
