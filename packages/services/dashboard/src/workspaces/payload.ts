import { Language, MakeRequestOptions } from "../types"
import { WorkspaceInvitationStatus, WorkspaceRole } from "./types"
export * as Seos from "../seos/payload"
export * as Articles from "./articles/payload"
export * as Councils from "./councils/payload"
export * as Directory from "./directory/payload"
export * as Events from "./events/payload"
export * as Forwards from "./forwards/payload"
export * as Libraries from "./libraries/payload"
export * as Medias from "./medias/payload"
export * as Menus from "./menus/payload"
export * as Pages from "./pages/payload"
export * as Slugs from "./slugs/payload"
export * as Templates from "./templates/payload"

export type UpdateWorkspace = {
  name?: string
  image?: File | null
  config?: Record<string, Record<string, unknown>>
  themeId?: string | null
  profileLogo?: File | null
  profile?: {
    // logo?: File | null
    translations?: Record<string, { welcomeMessage: string }>
  }
}
export type UpdateMember = {
  role: WorkspaceRole
}
export type CreateInvitation = {
  email: string
  role: WorkspaceRole
  language?: Language["id"]
}
export type Logs = MakeRequestOptions<
  string,
  {
    event?: string
    ipAddress?: string
    dateFrom?: string
    dateTo?: string
  }
>
export type InvitationSignUp = {
  token: string
  password: string
}
export type InvitationToken = {
  token: string
}
export type PublicInvitation = {
  workspace: string
  createdBy: string
  userExist: boolean
  email: string
  role: WorkspaceRole
  status: WorkspaceInvitationStatus
  createdAt: string
  expiresAt: string
}
