import { ServiceProvider } from "@/services/provider"
import { HotkeyConfigContext } from "@compo/hooks"
import { LocalizeProvider } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * Global Layout
 * This layout is used to display all the routes
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HotkeyConfigContext.Provider value={{ enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"], enableOnContentEditable: true }}>
      <Ui.Tooltip.Provider>
        <LocalizeProvider>
          <ServiceProvider>
            {children}
            <Ui.Toaster />
          </ServiceProvider>
        </LocalizeProvider>
      </Ui.Tooltip.Provider>
    </HotkeyConfigContext.Provider>
  )
}
export default Layout
