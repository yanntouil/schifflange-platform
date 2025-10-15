import { usePersistedState } from "@compo/hooks"
import React from "react"
import { z } from "zod"
import { Theme, ThemeContext, themes } from "./context"
import { getThemeScheme } from "./utils"

/**
 * ThemeProvider
 */
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  /**
   * Theme
   */
  const [theme, setTheme] = usePersistedState<Theme>("system", "theme", z.enum(themes), localStorage)
  const [scheme, setScheme] = React.useState<"light" | "dark">(() => getThemeScheme(theme))
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    const scheme = getThemeScheme(theme)
    setScheme(scheme)
    root.classList.add(scheme)
    return () => {
      root.classList.remove("light", "dark")
    }
  }, [theme])

  /**
   * Provider
   */
  return <ThemeContext.Provider value={{ theme, setTheme, scheme }}>{children}</ThemeContext.Provider>
}
