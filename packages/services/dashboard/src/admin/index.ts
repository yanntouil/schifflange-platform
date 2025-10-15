import { type CreateApi } from "../api"
import { Secure } from "../store"
import { emailLogs } from "./email-logs"
import { securityLogs } from "./security-logs"
import { users } from "./users"
import { workspaces } from "./workspaces"

export const admin = (api: CreateApi, secure: Secure) => ({
  users: users(api, secure),
  workspaces: workspaces(api, secure),
  securityLogs: securityLogs(api, secure),
  emailLogs: emailLogs(api, secure),
})
