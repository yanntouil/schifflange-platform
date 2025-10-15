import React from "react"
import { ManageMenu } from "./menu.context.actions"
import { SWRSafeMenu } from "./swr"

/**
 * types
 */
export type MenuContextType = {
  contextId: string
  swr: SWRSafeMenu
} & ManageMenu

/**
 * context
 */
export const MenuContext = React.createContext<MenuContextType | null>(null)

/**
 * hooks
 */
export const useMenu = () => {
  const context = React.useContext(MenuContext)
  if (!context) throw new Error("useMenu must be used within a MenuProvider")
  return context
}
