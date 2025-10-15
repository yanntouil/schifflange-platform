import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { AdminErrors, Me, PaginationMeta, UserSession, ValidationErrors } from "../../types"
import { appendQS } from "../../utils"
import { SecurityLog } from "../security-logs/types"
import { List, SecurityLogs, SendInvitation, Store, Update, UpdateProfile } from "./payload"
import { User, UserStats } from "./types"

export const users = (api: CreateApi, secure: Secure) => ({
  list: secure((query: List = {}) =>
    api.get<{ metadata: PaginationMeta; users: User[]; total: number }, AdminErrors>(appendQS("admin/users", query))
  ),
  store: secure((payload: Store) =>
    api.post<{ user: User }, AdminErrors | ValidationErrors>("admin/users", { data: payload })
  ),
  id: (id: string) => ({
    show: secure(() => api.get<{ user: User }, AdminErrors>(`admin/users/${id}`)),
    update: secure((payload: Update) =>
      api.put<{ user: User }, AdminErrors | ValidationErrors>(`admin/users/${id}`, { data: payload })
    ),
    destroy: secure(() => api.delete<{ user?: User }, AdminErrors>(`admin/users/${id}`)),
    sendInvitation: secure(({ invitationType }: SendInvitation) =>
      api.post<{ user: User }, AdminErrors>(`admin/users/${id}/send-invitation/${invitationType}`)
    ),
    signInAs: secure(() => api.post<{ user: Me; session: UserSession }, AdminErrors>(`admin/users/sign-in-as/${id}`)),
    updateProfile: secure((payload: UpdateProfile) =>
      api.transaction<{ user: User }, AdminErrors | ValidationErrors>(`admin/users/${id}/profile`, {
        data: payload,
        method: "PUT",
      })
    ),
    deactivateSession: secure((sessionId: string) =>
      api.delete<{ user: User }, AdminErrors>(`admin/users/${id}/sessions/${sessionId}`)
    ),
    securityLogs: secure((query: SecurityLogs) =>
      api.get<{ metadata: PaginationMeta; logs: SecurityLog[] }, AdminErrors>(
        appendQS(`admin/users/${id}/security-logs`, query)
      )
    ),
  }),
  emailExists: secure((email: string) =>
    api.post<{ exists: boolean }, AdminErrors>(`admin/users/email-exists`, { data: { email } })
  ),
  stats: secure(() => api.get<{ stats: UserStats }, AdminErrors>(`admin/users/stats`)),
})
