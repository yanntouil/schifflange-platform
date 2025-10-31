import { useDashboardService, type Api } from "@services/dashboard"
import React from "react"

/**
 * types
 */
export type ScheduleContextType = {
  contextId: string
  persistedId: string
  service: Api.ScheduleService
  schedule: Api.Schedule
  mutate: (schedule: Api.Schedule) => void
  edit: () => void
}

/**
 * contexts
 */
export const ScheduleContext = React.createContext<ScheduleContextType | null>(null)

/**
 * hooks
 */
export const useSchedule = () => {
  const context = React.useContext(ScheduleContext)
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  if (!context) throw new Error("useSchedule must be used within a ScheduleProvider")
  return { ...context, makePath, getImageUrl }
}
