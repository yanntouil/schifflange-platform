import { Theme } from "./context"

/**
 * helper to get the theme scheme
 */
export const getThemeScheme = (theme: Theme) => {
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    return systemTheme
  }
  return theme
}
