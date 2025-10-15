import React from "react"
import { TemplatesServiceContext, TemplatesServiceContextType } from "./service.context"

/**
 * TemplatesServiceProvider
 */
type TemplatesServiceProviderProps = TemplatesServiceContextType & {
  children: React.ReactNode
}
export const TemplatesServiceProvider: React.FC<TemplatesServiceProviderProps> = ({ children, ...props }) => {
  return <TemplatesServiceContext.Provider value={props}>{children}</TemplatesServiceContext.Provider>
}
