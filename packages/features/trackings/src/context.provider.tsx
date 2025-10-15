import { type Api } from "@services/dashboard"
import React from "react"
import { TrackingServiceContext } from "./context"

type TrackingServiceProviderProps = {
  service: Api.TrackingService
  children: React.ReactNode
}

export const TrackingServiceProvider: React.FC<TrackingServiceProviderProps> = ({ service, children }) => {
  return <TrackingServiceContext.Provider value={service}>{children}</TrackingServiceContext.Provider>
}
