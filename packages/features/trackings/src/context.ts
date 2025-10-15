import { type Api } from "@services/dashboard"
import { createContext, useContext } from "react"

export const TrackingServiceContext = createContext<Api.TrackingService | null>(null)

export const useTrackingService = () => {
  const context = useContext(TrackingServiceContext)
  if (!context) {
    throw new Error("useTrackingService must be used within a TrackingServiceProvider")
  }
  return context
}
