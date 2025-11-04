import { SidebarBottom } from "@/layouts/dashboard/sidebar.bottom"
import { SidebarFooter } from "@/layouts/dashboard/sidebar.footer"
import { SidebarHeader } from "@/layouts/dashboard/sidebar.header"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Home } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardRouteTo from "."
import { SidebarArticles } from "./articles/sidebar"
import { SidebarCouncils } from "./councils/sidebar"
import { SidebarDirectory } from "./directory/sidebar"
import { SidebarEvents } from "./events/sidebar"
import { SidebarLibraries } from "./libraries/sidebar"
import { SidebarMedias } from "./medias/sidebar"
import { SidebarPages } from "./pages/sidebar"
import { SidebarSite } from "./site/sidebar"

/**
 * Sidebar
 * Navigation specific to this workspace
 */
export const Sidebar: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  return (
    <Ui.Sidebar.Root variant="inset" collapsible="icon">
      <SidebarHeader />
      <Ui.Sidebar.Content>
        <div className="flex flex-col">
          <Ui.Sidebar.Group>
            <Ui.Sidebar.GroupContent>
              <Ui.Sidebar.Menu>
                <Ui.Sidebar.MenuItem>
                  <Ui.Sidebar.MenuButton tooltip={_("home")} asChild>
                    <Link href={dashboardRouteTo()}>
                      <Home />
                      <span>{_("home")}</span>
                    </Link>
                  </Ui.Sidebar.MenuButton>
                </Ui.Sidebar.MenuItem>
              </Ui.Sidebar.Menu>
            </Ui.Sidebar.GroupContent>
          </Ui.Sidebar.Group>

          <Ui.Sidebar.Group>
            <Ui.Sidebar.GroupLabel>
              <span>{_("section-content")}</span>
            </Ui.Sidebar.GroupLabel>
            <Ui.Sidebar.GroupContent>
              <SidebarPages />
              <SidebarArticles />
              <SidebarEvents />
            </Ui.Sidebar.GroupContent>
          </Ui.Sidebar.Group>
          <Ui.Sidebar.Group>
            <Ui.Sidebar.GroupLabel>
              <span>{_("section-resources")}</span>
            </Ui.Sidebar.GroupLabel>
            <Ui.Sidebar.GroupContent>
              <SidebarMedias />
              <SidebarDirectory />
              <SidebarLibraries />
              <SidebarCouncils />
            </Ui.Sidebar.GroupContent>
          </Ui.Sidebar.Group>
          <Ui.Sidebar.Group>
            <Ui.Sidebar.GroupLabel>
              <span>{_("section-settings")}</span>
            </Ui.Sidebar.GroupLabel>
            <Ui.Sidebar.GroupContent>
              <SidebarSite />
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
    "section-content": "Content",
    "section-resources": "Resources",
    "section-settings": "Settings",
  },
  fr: {
    home: "Accueil",
    "section-content": "Contenu",
    "section-resources": "Ressources",
    "section-settings": "Paramètres",
  },
  de: {
    home: "Startseite",
    "section-content": "Inhalt",
    "section-resources": "Ressourcen",
    "section-settings": "Einstellungen",
  },
}
