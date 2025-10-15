import { Api, Payload } from "@/services"
import React from "react"
import { useSwrUser } from "./swr"

/**
 * types
 */
export type UserContextType = {
  edit: () => void
  editProfile: () => void
  sendInvitation: (invitationType: Payload.Admin.Users.SendInvitation["invitationType"]) => Promise<void>
  signInAs: () => Promise<void>
  revokeAllSessions: () => Promise<void>
  revokeSession: (sessionId: string) => Promise<void>
  delete: () => void
  user: Api.Admin.User
  swr: ReturnType<typeof useSwrUser>["swr"]
}

/**
 * contexts
 */
export const UserContext = React.createContext<UserContextType | null>(null)

/**
 * hooks
 */
export const useUser = () => {
  const context = React.useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}
