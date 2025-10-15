import React from "react"
import { ArticlesServiceContext, ArticlesServiceContextType } from "./service.context"

/**
 * ArticlesServiceProvider
 */
type ArticlesServiceProviderProps = ArticlesServiceContextType & {
  children: React.ReactNode
}
export const ArticlesServiceProvider: React.FC<ArticlesServiceProviderProps> = ({ children, ...props }) => {
  return <ArticlesServiceContext.Provider value={props}>{children}</ArticlesServiceContext.Provider>
}
