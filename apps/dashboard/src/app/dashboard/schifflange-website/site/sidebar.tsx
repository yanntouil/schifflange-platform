import { useWorkspace } from "@/features/workspaces"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Globe2, Map, Settings, SquareMenu, TrendingUpDown } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

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
              <Link to={routesTo.menus.list()}>
                <SquareMenu aria-hidden />
                <span>{_("menus")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={routesTo.sitemap()}>
                <Map aria-hidden />
                <span>{_("sitemap")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={routesTo.forwards()}>
                <TrendingUpDown aria-hidden />
                <span>{_("forwards")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
            <Ui.Sidebar.CollapsibleMenuSubButton>
              <Link to={routesTo.config()}>
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
    menus: "Gérer les menus",
    sitemap: "Plan du site",
    forwards: "Gérer les redirections",
    config: "Configuration",
  },
  en: {
    title: "Site",
    menus: "Manage menus",
    sitemap: "Site map",
    forwards: "Manage forwards",
    config: "Configuration",
  },
  de: {
    title: "Website",
    menus: "Menüs verwalten",
    sitemap: "Sitemap",
    forwards: "Weiterleitungen verwalten",
    config: "Konfiguration",
  },
}
