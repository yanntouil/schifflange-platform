import { SidebarUsers } from "@/app/admin/users/sidebar"
import { SidebarWorkspaces } from "@/app/admin/workspaces/sidebar"
import { AuthSidebarButton } from "@/features/auth"
import { Ui } from "@compo/ui"
import React from "react"
import { SidebarHeader } from "./sidebar.header"
import { SidebarThemeSwitch } from "./sidebar.theme-switch"

/**
 * Admin Sidebar
 * this sidebar is used to navigate between the admin pages
 */
export const Sidebar: React.FC = () => {
  const { state } = Ui.useSidebar()
  return (
    <Ui.Sidebar.Root variant="inset" collapsible="icon">
      <SidebarHeader />
      <Ui.Sidebar.Content>
        <Ui.Sidebar.Group>
          <Ui.Sidebar.GroupContent>
            <SidebarWorkspaces />
            <SidebarUsers />
          </Ui.Sidebar.GroupContent>
        </Ui.Sidebar.Group>
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

/**
 * translations
 */
const dictionary = {
  fr: {
    "logo-aria-label": "Compo",
  },
  en: {
    "logo-aria-label": "Compo",
  },
  de: {
    "logo-aria-label": "Compo",
  },
}
