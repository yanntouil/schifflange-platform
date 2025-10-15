import { AuthSidebarButton } from "@/features/auth"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * SidebarFooter
 * this is the footer for the sidebar
 */
export const SidebarFooter: React.FC = () => {
  return (
    <Ui.Sidebar.Footer>
      <Ui.Sidebar.Menu>
        <AuthSidebarButton />
      </Ui.Sidebar.Menu>
    </Ui.Sidebar.Footer>
  )
}
