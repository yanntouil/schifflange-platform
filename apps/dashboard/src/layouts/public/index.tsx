import { SwitchLanguage } from "@/layouts/public/switch-language"
import { SwitchTheme } from "@/layouts/public/switch-theme"
import { Primitives } from "@compo/ui"
import React from "react"

/**
 * Public Layout
 * This layout is used to display the public routes
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-12">
      {children}
      <Primitives.Portal className="fixed top-0 right-0 flex h-14 items-center gap-2 px-2">
        <SwitchLanguage />
        <SwitchTheme />
      </Primitives.Portal>
    </div>
  )
}
export default Layout
