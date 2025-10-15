import { Address, ExtraField, MakeRequestOptions, UserRole, UserStatus } from "../../types"

/**
 * users payloads
 */
export type List = MakeRequestOptions<
  "email" | "role" | "status" | "createdAt" | "updatedAt",
  {
    role?: UserRole[]
    status?: UserStatus
  }
>

export type Store = {
  email: string
  password?: string
  role?: UserRole
  status?: UserStatus
  languageId?: string
}
export type Update = {
  email?: string
  password?: string
  role?: UserRole
  status?: UserStatus
  languageId?: string
  noEmit?: boolean
}
export type UpdateProfile = {
  firstname?: string
  lastname?: string
  dob?: string | null
  image?: File | null
  position?: string
  company?: string
  emails?: ExtraField[]
  phones?: ExtraField[]
  address?: Address
  extras?: ExtraField[]
}

export type SendInvitation = {
  invitationType: "password-reset" | "email-change" | "welcome" | "authentication"
}
export type SecurityLogs = MakeRequestOptions<
  string,
  {
    event?: string
    ipAddress?: string
    dateFrom?: string
    dateTo?: string
  }
>
