import { makeThemeStyles } from "@/app/admin/workspaces/themes/utils"
import { useWorkspace } from "@/features/workspaces"
import { Copyright } from "@/layouts/dashboard/copyright"
import { Header } from "@/layouts/dashboard/header"
import { localizeConfig } from "@compo/localize"
import { LanguagesProvider } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D } from "@compo/utils"
import React from "react"
import { Sidebar } from "./sidebar"

/**
 * Type-A Layout
 * This layout is used for Type-A workspaces
 */
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { workspace } = useWorkspace()
  const { scheme } = Ui.useTheme()
  const stylesTheme = makeThemeStyles(workspace.theme?.config ?? {})
  const styles = scheme === "dark" ? stylesTheme.dark : stylesTheme.light

  // if localizeConfig.defaultLanguage is in currentWorkspace.languages, use it, otherwise use the first language
  const fallbackLanguage = React.useMemo(
    () =>
      A.includes(A.map(workspace.languages, D.prop("code")), localizeConfig.defaultLanguage)
        ? localizeConfig.defaultLanguage
        : (A.head(workspace.languages)?.code ?? localizeConfig.defaultLanguage),
    [workspace.languages]
  )
  return (
    <LanguagesProvider fallbackLanguage={fallbackLanguage} languages={workspace.languages}>
      <div className="min-h-screen w-full" style={styles}>
        <Ui.Sidebar.Provider>
          <Sidebar />
          <Ui.Sidebar.Inset>
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
              <Copyright />
            </main>
          </Ui.Sidebar.Inset>
        </Ui.Sidebar.Provider>
      </div>
    </LanguagesProvider>
  )
}

export default Layout
