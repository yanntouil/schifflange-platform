"use client"

import { service } from "@/service"
import React from "react"

/**
 * send a request to the server to track the user's journey
 */
type TrackingProps = {
  trackingId: string
}
export const Tracking = ({ trackingId }: TrackingProps) => {
  //
  React.useEffect(() => {
    let trace: string | null = null

    // Start tracking request
    const startTracking = async () => {
      const res = await service.tracking(trackingId)
      if (res.ok) trace = res.data.traceId
    }

    // End tracking request
    const endTracking = async () => {
      if (!trace) return
      await service.tracking(trackingId, trace)
    }

    // Send the start tracking request when the component mounts
    startTracking()
    // Add an event listener to send the end tracking request before the window unloads
    window.addEventListener("beforeunload", endTracking)
    return () => {
      // Send the end tracking request when the component unmounts
      endTracking()
      // Remove the event listener when the component unmounts
      window.removeEventListener("beforeunload", endTracking)
    }
  }, [trackingId])
  return null
}
