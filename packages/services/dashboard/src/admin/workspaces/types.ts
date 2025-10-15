import { WithEmail } from "../../types"
import {
  AsWorkspaceMember,
  Workspace as BaseWorkspace,
  WorkspaceLog as BaseWorkspaceLog,
  WithInvitations,
  WithProfile,
  WithTheme,
} from "../../workspaces/types"
import { User } from "../types"

export type Workspace = BaseWorkspace & WithMembers & WithInvitations & WithTheme & WithProfile
export type WorkspaceMember = User & AsWorkspaceMember
export type WithMembers = {
  members: WorkspaceMember[]
}
export type WorkspaceLog = Omit<BaseWorkspaceLog, "workspace" | "user"> & {
  workspace: Workspace | null
  user: (User & WithEmail) | null
}
export type { WorkspaceInvitation, WorkspaceLogEventType, WorkspaceTheme } from "../../workspaces/types"
