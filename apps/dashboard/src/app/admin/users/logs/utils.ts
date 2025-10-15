import { Api } from "@/services"
import { A } from "@compo/utils"

/**
 * event guard
 */
export const eventGuard = (event: string): event is Api.Admin.SecurityEventType =>
  Object.values(securityEventsGrouped)
    .flat()
    .includes(event as Api.Admin.SecurityEventType)

/**
 * security events grouped
 */
export const securityEventsGrouped = {
  auth: ["login_success", "login_failed", "logout", "register"],
  email: ["email_verified", "email_change_requested", "email_change_completed"],
  password: ["password_reset_requested", "password_reset_completed"],
  accountStatus: ["account_locked", "account_unlocked", "account_deleted"],
  accountActivity: ["account_updated", "profile_updated"],
  session: ["session_created", "session_terminated"],
  userManagement: ["user_created", "user_updated", "user_deleted"],
  adminManagement: ["account_sign_in_as"],
} satisfies Record<string, Api.Admin.SecurityEventType[]>

/**
 * get event group
 */
export const getEventGroup = (event: Api.Admin.SecurityEventType) => {
  const groups = Object.entries(securityEventsGrouped)
  return A.find(groups, ([group, events]) => [...events].includes(event))?.[0] as keyof typeof securityEventsGrouped | undefined
}
