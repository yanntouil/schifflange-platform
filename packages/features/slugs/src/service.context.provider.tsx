import React from "react"
import { SlugsServiceContext, SlugsServiceContextType } from "./service.context"

/**
 * PagesServiceProvider
 */
type SlugsServiceProviderProps = SlugsServiceContextType & {
  children: React.ReactNode
}
export const SlugsServiceProvider: React.FC<SlugsServiceProviderProps> = ({ children, ...props }) => {
  return <SlugsServiceContext.Provider value={props}>{children}</SlugsServiceContext.Provider>
}
