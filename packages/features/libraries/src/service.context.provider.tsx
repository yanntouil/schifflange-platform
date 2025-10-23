import React from "react"
import { type LibrariesServiceContextType, LibrariesServiceContext } from "./service.context"

/**
 * LibrariesServiceProvider
 */
type LibrariesServiceProviderProps = LibrariesServiceContextType & {
  children: React.ReactNode
}
export const LibrariesServiceProvider: React.FC<LibrariesServiceProviderProps> = ({ children, ...props }) => {
  return <LibrariesServiceContext.Provider value={props}>{children}</LibrariesServiceContext.Provider>
}
