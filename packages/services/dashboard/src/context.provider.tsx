import React from "react"
import { DashboardServiceContext, DashboardServiceContextType } from "./context"
import { placeholder } from "./placeholder"

/**
 * DashboardServiceProvider
 */
type DashboardServiceProviderProps = Omit<DashboardServiceContextType, "placeholder"> & {
  children: React.ReactNode
}
export const DashboardServiceProvider: React.FC<DashboardServiceProviderProps> = ({ service, children }) => (
  <DashboardServiceContext.Provider value={{ service, placeholder }}>{children}</DashboardServiceContext.Provider>
)
