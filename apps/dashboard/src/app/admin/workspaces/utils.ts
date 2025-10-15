import { Api } from "@/services"

/**
 * workspace member roles guard
 */
export const workspaceRoles = ["owner", "admin", "member"] as const
export const workspaceRoleGuard = (role: string): role is Api.WorkspaceRole => workspaceRoles.includes(role as Api.WorkspaceRole)
