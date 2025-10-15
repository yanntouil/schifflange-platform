import { Selectable } from "@compo/hooks"
import { Api } from "@services/dashboard"
import React from "react"
import { ManageMenu } from "./menus.context.actions"
import { SWRMenus } from "./swr"

/**
 * types
 */
export type MenusContextType = Selectable<Api.Menu & Api.WithMenuItems> & {
  contextId: string
  swr: SWRMenus
} & ManageMenu

/**
 * context
 */
export const MenusContext = React.createContext<MenusContextType | null>(null)

/**
 * hooks
 */
export const useMenus = () => {
  const context = React.useContext(MenusContext)
  if (!context) throw new Error("useMenus must be used within a MenusProvider")
  return context
}
