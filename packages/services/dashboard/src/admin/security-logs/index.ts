import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { AdminErrors, PaginationMeta } from "../../types"
import { appendQS } from "../../utils"
import { List } from "./payload"
import { SecurityLog } from "./types"

export const securityLogs = (api: CreateApi, secure: Secure) => ({
  list: secure((query: List = {}) =>
    api.get<{ metadata: PaginationMeta; logs: SecurityLog[] }, AdminErrors>(appendQS("admin/security-logs", query))
  ),
  id: (id: string) => ({
    show: secure(() => api.get<{ log: SecurityLog }, AdminErrors>(`admin/security-logs/${id}`)),
  }),
})
