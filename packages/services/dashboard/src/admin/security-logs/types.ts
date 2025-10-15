import { User } from "../types"

export type SecurityEventType =
  | "login_success"
  | "login_failed"
  | "logout"
  | "register"
  | "email_verified"
  | "password_reset_requested"
  | "password_reset_completed"
  | "email_change_requested"
  | "email_change_completed"
  | "account_locked"
  | "account_unlocked"
  | "account_updated"
  | "account_deleted"
  | "session_created"
  | "session_terminated"
  | "profile_updated"
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "account_sign_in_as"
export type SecurityLog = {
  id: string
  userId: string | null
  user: User | null
  event: SecurityEventType
  ipAddress: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
