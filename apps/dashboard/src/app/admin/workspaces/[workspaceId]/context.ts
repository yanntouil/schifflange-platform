import { Api, service } from "@/services"
import React from "react"
import { useSwrWorkspace } from "./swr"

/**
 * types
 */
export type WorkspaceContext = {
  edit: () => void
  editProfile: () => void
  delete: () => void
  removeMember: (member: Api.Admin.WorkspaceMember) => void
  changeRole: (member: Api.Admin.WorkspaceMember, newRole: Api.WorkspaceRole) => void
  removeInvitation: (invitation: Api.Admin.WorkspaceInvitation) => void
  workspace: Api.Admin.Workspace
  swr: ReturnType<typeof useSwrWorkspace>["swr"]
  service: ReturnType<typeof service.admin.workspaces.id>
}

/**
 * contexts
 */
export const WorkspaceContext = React.createContext<WorkspaceContext | null>(null)

/**
 * hooks
 */
export const useWorkspace = () => {
  const context = React.useContext(WorkspaceContext)
  if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider")
  return context
}
