import { Api } from "@/services"
import { Selectable } from "@compo/hooks"
import React from "react"
import { useSwrWorkspaces } from "./swr"

/**
 * types
 */
export type WorkspacesContext = Selectable<{ id: string }> & {
  create: () => void
  display: (value: Api.Workspace) => void
  edit: (value: Api.Admin.Workspace) => void
  editProfile: (value: Api.Admin.Workspace) => void
  delete: (value: string) => void
  deleteSelection: () => void
} & ReturnType<typeof useSwrWorkspaces>

/**
 * contexts
 */
export const WorkspacesContext = React.createContext<WorkspacesContext | null>(null)

/**
 * hooks
 */
export const useWorkspaces = () => {
  const context = React.useContext(WorkspacesContext)
  if (!context) throw new Error("useWorkspaces must be used within a WorkspacesProvider")
  return context
}
