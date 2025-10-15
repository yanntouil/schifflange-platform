import React from "react"
import { MenusServiceContext, MenusServiceContextType } from "./service.context"

/**
 * MenusServiceProvider
 */
type MenusServiceProviderProps = MenusServiceContextType & {
  children: React.ReactNode
}
export const MenusServiceProvider: React.FC<MenusServiceProviderProps> = ({ children, ...props }) => {
  return <MenusServiceContext.Provider value={props}>{children}</MenusServiceContext.Provider>
}
