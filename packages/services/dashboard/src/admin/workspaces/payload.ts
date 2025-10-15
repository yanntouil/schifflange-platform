import { MakeRequestOptions } from "../../types"
import { WorkspaceRole, WorkspaceStatus, WorkspaceType } from "../../workspaces/types"

/**
 * workspaces payloads
 */
export type List = MakeRequestOptions<
  "name" | "status" | "createdAt" | "updatedAt",
  {
    type?: WorkspaceType
    status?: WorkspaceStatus
    dateFrom?: string
    dateTo?: string
  }
>

export type Create = {
  name: string
  theme?: string // id of the theme
  status?: WorkspaceStatus
  config?: Record<string, Record<string, unknown>>
  image?: File | null
}
export type Update = {
  name?: string
  type?: WorkspaceType
  themeId?: string | null
  status?: WorkspaceStatus
  config?: Record<string, Record<string, unknown>>
  image?: File | null
  noEmit?: boolean
}
export type UpdateMember = {
  role: WorkspaceRole
}
export type UpdateProfile = {
  logo?: File | null
}
export type AttachMember = {
  role: WorkspaceRole
}
export type DetachMember = {
  role: WorkspaceRole
}
export type CreateInvitation = {
  email: string
  language?: string
  role?: WorkspaceRole
}

/**
 * themes payloads
 */
export type ThemesList = MakeRequestOptions<
  "name" | "isDefault",
  {
    isDefault?: boolean
  }
>

export type CreateTheme = {
  name: string
  description?: string
  isDefault?: boolean
  config?: Record<string, unknown>
  image?: File | null
}

export type UpdateTheme = {
  name?: string
  description?: string
  isDefault?: boolean
  config?: Record<string, unknown>
  image?: File | null
}
