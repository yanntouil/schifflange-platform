import type { Address, DeviceInfo, ExtraField, Language, SingleImage } from "../types"

/**
 * define the user type use in the api
 */
export type User = {
  id: string
  role: UserRole
  status: UserStatus
  isAdmin: boolean
  isSuperAdmin: boolean
  profile: UserProfile
  languageId: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}
export type UserStatus = "pending" | "active" | "deleted" | "suspended"
export type UserRole = "member" | "admin" | "superadmin"
export type UserProfile = {
  firstname: string
  lastname: string
  image: SingleImage | null
  dob: string | null
  position: string
  company: string
  phones: ExtraField[]
  emails: ExtraField[]
  address: Address
  extras: ExtraField[]
}

/**
 * define the user session type use in the api
 */
export type UserSession = {
  id: string
  userId: string
  ipAddress: string
  deviceInfo: DeviceInfo
  deviceName: string | null
  token: string
  lastActivity: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * optional relations
 */
export type WithLanguage = {
  language: Language
}

export type WithSessions = {
  sessions: UserSession[]
}

export type WithEmail = {
  email: string
}
