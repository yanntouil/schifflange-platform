import React from "react"
import { type CouncilsServiceContextType, CouncilsServiceContext } from "./service.context"

/**
 * CouncilsServiceProvider
 */
type CouncilsServiceProviderProps = CouncilsServiceContextType & {
  children: React.ReactNode
}
export const CouncilsServiceProvider: React.FC<CouncilsServiceProviderProps> = ({ children, ...props }) => {
  return <CouncilsServiceContext.Provider value={props}>{children}</CouncilsServiceContext.Provider>
}
