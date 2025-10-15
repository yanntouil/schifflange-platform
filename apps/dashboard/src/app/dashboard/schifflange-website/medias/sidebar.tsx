import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ImagePlay } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import dashboardMediasRouteTo from "."

/**
 * Dashboard Medias Sidebar
 * this sidebar is used to navigate between the dashboard medias
 */
export const SidebarMedias: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Sidebar.Menu>
      <Ui.Sidebar.MenuItem>
        <Ui.Sidebar.MenuButton tooltip={_("title")} asChild>
          <Link to={dashboardMediasRouteTo()}>
            <ImagePlay />
            <span>{_("title")}</span>
          </Link>
        </Ui.Sidebar.MenuButton>
      </Ui.Sidebar.MenuItem>
    </Ui.Sidebar.Menu>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Médias",
  },
  en: {
    title: "Medias",
  },
  de: {
    title: "Medien",
  },
}
