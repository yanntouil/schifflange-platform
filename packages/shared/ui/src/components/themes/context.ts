import React from "react"
import { F } from "@compo/utils"

/**
 * ThemeContext
 */
export type ThemeContextProps = {
  theme: Theme
  scheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}
export type Theme = (typeof themes)[number]

/**
 * contexts
 */
export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: "system",
  scheme: "light",
  setTheme: F.ignore,
})

/**
 * hooks
 */
export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

/**
 * constants
 */
export const themes = ["light", "dark", "system"] as const
