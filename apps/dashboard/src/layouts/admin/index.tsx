import { Ui } from "@compo/ui"
import React from "react"
import { Copyright } from "./copyright"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

/**
 * Admin Layout
 * This layout is used to display the admin routes
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Ui.Sidebar.Provider>
      <Sidebar />
      <Ui.Sidebar.Inset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
        <Copyright />
      </Ui.Sidebar.Inset>
    </Ui.Sidebar.Provider>
  )
}
export default Layout
