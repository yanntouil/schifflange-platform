import React from "react"
import { DirectoryServiceContext, DirectoryServiceContextType } from "./service.context"

/**
 * DirectoryServiceProvider
 */
type DirectoryServiceProviderProps = DirectoryServiceContextType & {
  children: React.ReactNode
}
export const DirectoryServiceProvider: React.FC<DirectoryServiceProviderProps> = ({ children, ...props }) => {
  return <DirectoryServiceContext.Provider value={props}>{children}</DirectoryServiceContext.Provider>
}
