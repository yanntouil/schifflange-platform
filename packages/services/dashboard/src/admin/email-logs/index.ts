import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { AdminErrors, PaginationMeta } from "../../types"
import { appendQS } from "../../utils"
import { List } from "./payload"
import { EmailLog } from "./types"

export const emailLogs = (api: CreateApi, secure: Secure) => ({
  list: secure((query: List = {}) =>
    api.get<{ metadata: PaginationMeta; emails: EmailLog[] }, AdminErrors>(appendQS("admin/email-logs", query))
  ),
  id: (id: string) => ({
    show: secure(() => api.get<{ emails: EmailLog }, AdminErrors>(`admin/email-logs/${id}`)),
    resend: secure(() => api.post<{ emails: EmailLog }, AdminErrors>(`admin/email-logs/${id}`)),
    preview: secure(() => api.get<{ preview: string }, AdminErrors>(`admin/email-logs/${id}/preview`)),
  }),
})
