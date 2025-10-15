import { Api } from "@/services"

/**
 * workspace member roles guard
 */
export const workspaceRoles = ["owner", "admin", "member"] as const
export const workspaceRoleGuard = (role: string): role is Api.WorkspaceRole => workspaceRoles.includes(role as Api.WorkspaceRole)

/**
 * workspace constants
 */
export const workspaceTypes = ["lumiq", "type-a", "type-b", "type-c"] as const
export const workspaceTypeGuard = (type: string): type is (typeof workspaceTypes)[number] => workspaceTypes.includes(type as any)
export const workspaceStatuses = ["active", "suspended", "deleted"] as const
export const workspaceStatusGuard = (status: string): status is (typeof workspaceStatuses)[number] =>
  workspaceStatuses.includes(status as any)

/**
 * role helpers
 */
export const isWorkspaceAdmin = (role: Api.Workspace & Api.AsMemberOfWorkspace) => role.memberRole === "admin" || isWorkspaceOwner(role)
export const isWorkspaceMember = (role: Api.Workspace & Api.AsMemberOfWorkspace) => role.memberRole === "member" || isWorkspaceAdmin(role)
export const isWorkspaceOwner = (role: Api.Workspace & Api.AsMemberOfWorkspace) => role.memberRole === "owner"
