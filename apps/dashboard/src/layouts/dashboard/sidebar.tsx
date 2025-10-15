import { AuthSidebarButton } from "@/features/auth"
import { Ui } from "@compo/ui"
import React from "react"
import { SidebarBottom } from "./sidebar.bottom"
import { SidebarHeader } from "./sidebar.header"

/**
 * Dashboard Sidebar
 * this sidebar is used to navigate between the dashboard pages
 */
export const Sidebar: React.FC = () => {
  return (
    <Ui.Sidebar.Root variant="inset" collapsible="icon">
      <SidebarHeader />
      <Ui.Sidebar.Content>
        <SidebarBottom />
      </Ui.Sidebar.Content>
      <Ui.Sidebar.Footer>
        <Ui.Sidebar.Menu>
          <AuthSidebarButton />
        </Ui.Sidebar.Menu>
      </Ui.Sidebar.Footer>
    </Ui.Sidebar.Root>
  )
}
