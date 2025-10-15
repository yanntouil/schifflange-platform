import type { Language, SingleImage, User } from "../types"
export * from "./articles/types"
export * from "./forwards/types"
export * from "./medias/types"
export * from "./pages/types"
export * from "./projects/types"
export * from "./slugs/types"
export * from "./templates/types"

export type WorkspaceRole = "member" | "admin" | "owner"
export type WorkspaceStatus = "active" | "deleted" | "suspended"
export type WorkspaceType = "schifflange-website"
export type WorkspaceInvitationStatus = "pending" | "refused" | "accepted" | "deleted"
export type WorkspaceInvitation = {
  id: string
  email: string
  status: WorkspaceInvitationStatus
  expiresAt: string
  deletedAt: string | null
  role: WorkspaceRole
  createdBy: User | null
  createdAt: string
  updatedAt: string
}
export type WorkspaceTheme = {
  id: string
  name: string
  description: string
  isDefault: boolean
  image: SingleImage | null
  config: Record<string, Record<string, unknown>>
}
export type WorkspaceProfile = {
  id: string
  logo: SingleImage | null
  translations: WorkspaceProfileTranslation[]
}
export type WorkspaceProfileTranslation = {
  languageId: string
  welcomeMessage: string
}
export type WorkspaceConfig = {
  site: {
    url: string
  }
  articles: {
    slugPrefix: string
  }
  projects: {
    slugPrefix: string
  }
}
export type Workspace = {
  id: string
  name: string
  image: SingleImage | null
  status: WorkspaceStatus
  type: WorkspaceType
  config: WorkspaceConfig
  languages: Language[]
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * variants
 */
export type AsWorkspaceMember = {
  workspaceRole: WorkspaceRole
  workspaceCreatedAt: string
}
export type AsMemberOfWorkspace = {
  memberRole: WorkspaceRole
  memberCreatedAt: string
  totalMembers: number
}
/**
 * left joins
 */
export type WithTheme = {
  theme: WorkspaceTheme | null
}
export type WithProfile = {
  profile: WorkspaceProfile
}
export type WithInvitations = {
  invitations: WorkspaceInvitation[]
}
export type WithMembers = {
  members: WorkspaceMember[]
}
export type WithTotalMembers = {
  totalMembers: number
}

export type WorkspaceMember = User & AsWorkspaceMember

/**
 * logs
 */
export type WorkspaceLog = {
  id: string
  workspaceId: string | null
  workspace: Workspace | null
  userId: string | null
  user: User | null
  event: WorkspaceLogEventType
  ipAddress: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
export type WorkspaceLogEventType =
  | "deleted"
  | "created"
  | "updated"
  | "member-updated"
  | "member-attached"
  | "member-removed"
  | "member-left"
  | "member-joined"
  | "invitation-created"
  | "invitation-deleted"
