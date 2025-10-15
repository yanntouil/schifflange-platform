import React from "react"
import { LanguagesServiceContext, LanguagesServiceContextType } from "./service.context"

/**
 * LanguagesServiceProvider
 */
type LanguagesServiceProviderProps = LanguagesServiceContextType & {
  children: React.ReactNode
}
export const LanguagesServiceProvider: React.FC<LanguagesServiceProviderProps> = ({ children, ...props }) => {
  return <LanguagesServiceContext.Provider value={props}>{children}</LanguagesServiceContext.Provider>
}
