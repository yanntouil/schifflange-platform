import { AuthDialogTabWorkspacesConfig } from "@/features/workspaces/components/dialog/config"
import { AuthDialogTabWorkspacesInvitations } from "@/features/workspaces/components/dialog/invitations"
import { AuthDialogTabWorkspacesMembers } from "@/features/workspaces/components/dialog/members"
import React from "react"
import { AuthDialogTabAuthentication } from "./authentication"
import { AuthDialogTabNotifications } from "./notifications"
import { AuthDialogTabProfile } from "./profile"

/**
 * types
 */
export type AuthDialogTab =
  | AuthDialogTabAuthentication
  | AuthDialogTabProfile
  | AuthDialogTabNotifications
  | AuthDialogTabWorkspacesConfig
  | AuthDialogTabWorkspacesMembers
  | AuthDialogTabWorkspacesInvitations

export type AuthDialogContextType = {
  tab: AuthDialogTab | null
  setTab: (tab: AuthDialogTab | null) => void
}

/**
 * context
 */
export const AuthDialogContext = React.createContext<AuthDialogContextType>({
  tab: null,
  setTab: () => {},
})

/**
 * hooks
 */
export const useAuthDialog = () => {
  const context = React.useContext(AuthDialogContext)
  if (!context) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider")
  }
  return context
}

/**
 * helpers
 */
export const isDialogOpen = (tab: AuthDialogTab | null): tab is AuthDialogTab => tab !== null
export const getTab = (tab: Option<string>): AuthDialogTab["type"] =>
  match(tab)
    .with("profile", () => "profile" as const)
    .with("notifications", () => "notifications" as const)
    .with("workspaces-config", () => "workspaces-config" as const)
    .with("workspaces-members", () => "workspaces-members" as const)
    .with("workspaces-invitations", () => "workspaces-invitations" as const)
    .otherwise(() => "authentication" as const) // as default
