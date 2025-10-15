import { useWorkspace } from "@/features/workspaces"
import { SidebarHeader } from "@/layouts/admin/sidebar.header"
import { SidebarBottom } from "@/layouts/dashboard/sidebar.bottom"
import { SidebarFooter } from "@/layouts/dashboard/sidebar.footer"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FileText, Home, Settings } from "lucide-react"
import React from "react"

/**
 * Type-A Sidebar
 * Navigation specific to Type-A workspaces
 */
export const Sidebar: React.FC = () => {
  const { workspace } = useWorkspace()
  const { _ } = useTranslation(dictionary)
  const { state } = Ui.useSidebar()

  return (
    <Ui.Sidebar.Root variant="inset" collapsible="icon">
      <SidebarHeader />
      <Ui.Sidebar.Content>
        <div className="flex flex-col">
          {/* import each feature sidebar here */}
          <Ui.Sidebar.Group>
            <Ui.Sidebar.GroupLabel>{workspace.name}</Ui.Sidebar.GroupLabel>
            <Ui.Sidebar.GroupContent>
              <Ui.Sidebar.Menu>
                <Ui.Sidebar.MenuItem>
                  <Ui.Sidebar.MenuButton tooltip={_("home")} asChild>
                    <a href="/type-a">
                      <Home />
                      <span>{_("home")}</span>
                    </a>
                  </Ui.Sidebar.MenuButton>
                </Ui.Sidebar.MenuItem>
                <Ui.Sidebar.MenuItem>
                  <Ui.Sidebar.MenuButton tooltip={_("pages")} asChild>
                    <a href="/type-a/pages">
                      <FileText />
                      <span>{_("pages")}</span>
                    </a>
                  </Ui.Sidebar.MenuButton>
                </Ui.Sidebar.MenuItem>
                <Ui.Sidebar.MenuItem>
                  <Ui.Sidebar.MenuButton tooltip={_("settings")} asChild>
                    <a href="/type-a/settings">
                      <Settings />
                      <span>{_("settings")}</span>
                    </a>
                  </Ui.Sidebar.MenuButton>
                </Ui.Sidebar.MenuItem>
              </Ui.Sidebar.Menu>
            </Ui.Sidebar.GroupContent>
          </Ui.Sidebar.Group>
        </div>
        <SidebarBottom />
      </Ui.Sidebar.Content>
      <SidebarFooter />
    </Ui.Sidebar.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    home: "Home",
    pages: "Pages",
    settings: "Settings",
  },
  fr: {
    home: "Accueil",
    pages: "Pages",
    settings: "Paramètres",
  },
  de: {
    home: "Startseite",
    pages: "Seiten",
    settings: "Einstellungen",
  },
}
