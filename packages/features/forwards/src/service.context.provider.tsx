import React from "react"
import { ForwardsServiceContext, ForwardsServiceContextType } from "./service.context"

/**
 * ForwardsServiceProvider
 */
type ForwardsServiceProviderProps = ForwardsServiceContextType & {
  children: React.ReactNode
}
export const ForwardsServiceProvider: React.FC<ForwardsServiceProviderProps> = ({ children, ...props }) => {
  return <ForwardsServiceContext.Provider value={props}>{children}</ForwardsServiceContext.Provider>
}
