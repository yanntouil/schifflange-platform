import adminRouteTo from "@/app/admin"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { SidebarThemeSwitch } from "@/layouts/dashboard/sidebar.theme-switch"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Shield } from "lucide-react"
import React from "react"
import { Link } from "wouter"

/**
 * SidebarBottom
 * this is the bottom of the sidebar, it contains the theme switch and the auth button
 */
export const SidebarBottom: React.FC = () => {
  const { me } = useAuth()
  const isAdmin = me.role === "admin" || me.role === "superadmin"
  return (
    <Ui.Sidebar.Group className="mt-auto flex flex-col gap-3">
      <Ui.Sidebar.GroupContent>
        <Ui.Sidebar.Menu>{isAdmin && <SidebarAdminMenu />}</Ui.Sidebar.Menu>
      </Ui.Sidebar.GroupContent>
      <Ui.Sidebar.GroupContent>
        <Ui.Sidebar.Menu>
          <SidebarThemeSwitch />
        </Ui.Sidebar.Menu>
      </Ui.Sidebar.GroupContent>
    </Ui.Sidebar.Group>
  )
}

const SidebarAdminMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.Sidebar.MenuItem>
      <Ui.Sidebar.MenuButton tooltip={_("home")} asChild>
        <Link to={adminRouteTo()}>
          <Shield aria-hidden />
          <span>{_("admin")}</span>
        </Link>
      </Ui.Sidebar.MenuButton>
    </Ui.Sidebar.MenuItem>
  )
}

/**
 * translations
 */

const dictionary = {
  en: {
    admin: "Administration",
  },
  fr: {
    admin: "Administration",
  },
  de: {
    admin: "Verwaltung",
  },
}
