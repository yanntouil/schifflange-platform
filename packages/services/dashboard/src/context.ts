"use client"

import React from "react"
import { placeholder } from "./placeholder"
import { createService } from "./service"

/**
 * types
 */
export type DashboardServiceContextType = {
  service: ReturnType<typeof createService>
  placeholder: typeof placeholder
}

/**
 * contexts
 */
export const DashboardServiceContext = React.createContext<DashboardServiceContextType | null>(null)

/**
 * hooks
 */
export const useDashboardService = () => {
  const context = React.useContext(DashboardServiceContext)
  if (!context) {
    throw new Error("useDashboardService must be used within a DashboardServiceProvider")
  }
  return context
}
