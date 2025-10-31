import React from "react"
import { EventsServiceContext, EventsServiceContextType } from "./service.context"

/**
 * EventsServiceProvider
 */
type EventsServiceProviderProps = EventsServiceContextType & {
  children: React.ReactNode
}
export const EventsServiceProvider: React.FC<EventsServiceProviderProps> = ({ children, ...props }) => {
  return <EventsServiceContext.Provider value={props}>{children}</EventsServiceContext.Provider>
}
