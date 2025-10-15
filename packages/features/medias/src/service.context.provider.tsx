import React from "react"
import { MediasServiceContext, MediasServiceContextType } from "./service.context"

/**
 * MediasServiceProvider
 */
type MediasServiceProviderProps = MediasServiceContextType & {
  children: React.ReactNode
}
export const MediasServiceProvider: React.FC<MediasServiceProviderProps> = ({ children, ...props }) => (
  <MediasServiceContext.Provider value={props}>{children}</MediasServiceContext.Provider>
)
