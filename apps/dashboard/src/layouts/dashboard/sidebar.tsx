import { AuthSidebarButton } from "@/features/auth"
import { Ui } from "@compo/ui"
import React from "react"
import { SidebarHeader } from "./sidebar.header"
import { SidebarThemeSwitch } from "./sidebar.theme-switch"

/**
 * Dashboard Sidebar
 * this sidebar is used to navigate between the dashboard pages
 */
export const Sidebar: React.FC = () => {
  return (
    <Ui.Sidebar.Root variant="inset" collapsible="icon">
      <SidebarHeader />
      <Ui.Sidebar.Content>
        <div className="flex flex-col">{/* <SidebarDashboard /> */}</div>
        <Ui.Sidebar.Group className="mt-auto">
          <Ui.Sidebar.GroupContent>
            <Ui.Sidebar.Menu>
              <SidebarThemeSwitch />
            </Ui.Sidebar.Menu>
          </Ui.Sidebar.GroupContent>
        </Ui.Sidebar.Group>
      </Ui.Sidebar.Content>
      <Ui.Sidebar.Footer>
        <Ui.Sidebar.Menu>
          <AuthSidebarButton />
        </Ui.Sidebar.Menu>
      </Ui.Sidebar.Footer>
    </Ui.Sidebar.Root>
  )
}
