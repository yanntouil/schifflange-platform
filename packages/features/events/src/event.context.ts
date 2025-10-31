import React from "react"
import { ManageEvent } from "./event.context.actions"
import { SWRSafeEvent } from "./swr.event"

/**
 * types
 */
export type EventContextType = {
  contextId: string
  swr: SWRSafeEvent
} & ManageEvent

/**
 * contexts
 */
export const EventContext = React.createContext<EventContextType | null>(null)

/**
 * hooks
 */
export const useEvent = () => {
  const context = React.useContext(EventContext)
  if (!context) throw new Error("useEvent must be used within an EventProvider")
  return context
}
