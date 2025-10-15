import { useWorkspace } from "@/features/workspaces"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Globe2, Map, Settings, SquareMenu, TrendingUpDown } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardConfigRouteTo from "./config"
import dashboardForwardsRouteTo from "./forwards"
import dashboardMenusRouteTo from "./menus"
import dashboardSitemapRouteTo from "./sitemap"

/**
 * Dashboard Site Sidebar
 * this sidebar is used to navigate between the dashboard site
 */
export const SidebarSite: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  return (
    <>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-site-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Globe2 className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardMenusRouteTo()}>
                <SquareMenu aria-hidden />
                <span>{_("menus")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardSitemapRouteTo()}>
                <Map aria-hidden />
                <span>{_("sitemap")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardForwardsRouteTo()}>
                <TrendingUpDown aria-hidden />
                <span>{_("forwards")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={dashboardConfigRouteTo()}>
                <Settings aria-hidden />
                <span>{_("config")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Site",
    menus: "Menus",
    sitemap: "Plan du site",
    forwards: "Redirections",
    config: "Configuration",
  },
  en: {
    title: "Site",
    menus: "Menus",
    sitemap: "Site map",
    forwards: "Forwards",
    config: "Configuration",
  },
  de: {
    title: "Website",
    menus: "Menüs",
    sitemap: "Sitemap",
    forwards: "Weiterleitungen",
    config: "Konfiguration",
  },
}
