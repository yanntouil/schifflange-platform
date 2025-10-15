import dashboardRouteTo, { dashboardRoutesByType } from "@/app/dashboard"
import { useWorkspaces } from "@/features/workspaces"
import { Ui } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import { SidebarLogo } from "./sidebar.logo"

/**
 * Dashboard Sidebar Header
 * this sidebar header is used for the dashboard navigation
 */
export const SidebarHeader: React.FC = () => {
  const { currentWorkspace } = useWorkspaces()
  const route = currentWorkspace ? dashboardRoutesByType(currentWorkspace.type) : dashboardRouteTo()
  return (
    <Ui.Sidebar.Header>
      <Ui.Sidebar.Menu className="border-border border-b pb-2">
        <Ui.Sidebar.MenuItem>
          <Ui.Sidebar.MenuButton size="lg" asChild>
            <Link to={route}>
              <SidebarLogo />
            </Link>
          </Ui.Sidebar.MenuButton>
        </Ui.Sidebar.MenuItem>
      </Ui.Sidebar.Menu>
    </Ui.Sidebar.Header>
  )
}
