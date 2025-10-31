import { Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type EventsServiceContextType = {
  service: Api.EventsService
  serviceKey: string
  isAdmin: boolean
  routesTo: {
    events: {
      list: () => string
      byId: (eventId: string) => string
    }
  }
  makeUrl: (slug: Api.Slug, code?: string) => string
  publishedUsers: Api.User[]
}

/**
 * contexts
 */
export const EventsServiceContext = createContext<EventsServiceContextType | null>(null)

/**
 * hooks
 */
export const useEventsService = () => {
  const context = useContext(EventsServiceContext)
  if (!context) {
    throw new Error("useEventsService must be used within a EventsServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
