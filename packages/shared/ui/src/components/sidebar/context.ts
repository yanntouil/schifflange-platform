import * as React from "react"

/**
 * type
 */
export type SidebarContextType = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  sidebarWidth: string
  sidebarWidthIcon: string
  sidebarWidthMobile: string
}

/**
 * context
 */
export const SidebarContext = React.createContext<SidebarContextType | null>(null)

/**
 *
 * hook
 */
export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}
