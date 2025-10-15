import { Api } from "@/services"
import { Selectable } from "@compo/hooks"
import React from "react"
import { useSwrThemes } from "./swr"

/**
 * types
 */
export type ThemesContext = Selectable<{ id: string }> & {
  create: () => void
  edit: (value: Api.Admin.WorkspaceTheme) => void
  preview: (value: Api.Admin.WorkspaceTheme) => void
  delete: (value: string) => void
  deleteSelection: () => void
} & ReturnType<typeof useSwrThemes>

/**
 * contexts
 */
export const ThemesContext = React.createContext<ThemesContext | null>(null)

/**
 * hooks
 */
export const useThemes = () => {
  const context = React.useContext(ThemesContext)
  if (!context) throw new Error("useThemes must be used within a ThemesProvider")
  return context
}
