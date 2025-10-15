import React from "react"
import { PagesServiceContext, PagesServiceContextType } from "./service.context"

/**
 * PagesServiceProvider
 */
type PagesServiceProviderProps = PagesServiceContextType & {
  children: React.ReactNode
}
export const PagesServiceProvider: React.FC<PagesServiceProviderProps> = ({ children, ...props }) => {
  return <PagesServiceContext.Provider value={props}>{children}</PagesServiceContext.Provider>
}
