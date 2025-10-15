import React from "react"

/**
 * types
 */
export type MenuContextType = {
  type: "context-menu" | "dropdown-menu"
}

/**
 * context
 */
export const MenuContext = React.createContext<MenuContextType | null>(null)

/**
 * hook
 */
export const useMenu = () => {
  const context = React.useContext(MenuContext)
  if (!context) {
    throw new Error("useMenu must be used within a MenuRoot")
  }
  return context
}
export const useIsContextMenu = () => {
  const { type } = useMenu()
  return type === "context-menu"
}
export const useIsDropdownMenu = () => {
  const { type } = useMenu()
  return type === "dropdown-menu"
}
