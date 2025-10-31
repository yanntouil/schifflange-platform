import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageEvent } from "./events.context.actions"
import { SWREvents } from "./swr.events"

/**
 * types
 */
export type EventsContextType = Selectable<Api.EventWithRelations> & {
  contextId: string
  swr: SWREvents
} & ManageEvent

/**
 * contexts
 */
export const EventsContext = React.createContext<EventsContextType | null>(null)

/**
 * hooks
 */
export const useEvents = () => {
  const context = React.useContext(EventsContext)
  if (!context) throw new Error("useEvents must be used within a EventsProvider")
  return context
}
