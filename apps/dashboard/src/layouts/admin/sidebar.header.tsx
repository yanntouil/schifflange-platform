import adminRouteTo from "@/app/admin"
import { Ui } from "@compo/ui"
import React from "react"
import { Link } from "wouter"
import { SidebarLogo } from "./sidebar.logo"

/**
 * Admin Sidebar
 * this sidebar is used to navigate between the admin pages
 */
export const SidebarHeader: React.FC = () => {
  const { state } = Ui.useSidebar()
  return (
    <Ui.Sidebar.Header>
      <Ui.Sidebar.Menu className="border-border border-b pb-2">
        <Ui.Sidebar.MenuItem>
          <Ui.Sidebar.MenuButton
            size="lg"
            // className={cxm("transition-height overflow-visible duration-300", state === "collapsed" ? "h-12" : "h-12")}
            asChild
          >
            <Link to={adminRouteTo()}>
              <SidebarLogo />
            </Link>
          </Ui.Sidebar.MenuButton>
        </Ui.Sidebar.MenuItem>
        {/* {state !== "collapsed" && (
            <div className="text-primary line-clamp-2 max-w-[180px] p-2 text-xs leading-tight tracking-tight">{_("secondary")}</div>
          )} */}
      </Ui.Sidebar.Menu>
    </Ui.Sidebar.Header>
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
