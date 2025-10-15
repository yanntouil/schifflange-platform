import { type CreateApi } from "../api"
import { type Secure } from "../store"
import { AuthErrors } from "../types"
import { appendQS } from "../utils"
import type { List } from "./payload"
import type { Notification } from "./types"

export const notifications = (api: CreateApi, secure: Secure) => ({
  list: secure((query: List = {}) =>
    api.get<{ notifications: Notification[]; metadata: any; total: number }, AuthErrors>(
      appendQS("auth/notifications", query)
    )
  ),
  markAsRead: secure((id: string) => api.put<{ notification: Notification }, AuthErrors>(`auth/notifications/${id}`)),
  markAllAsRead: secure(() => api.put<{ updated: number }, AuthErrors>("auth/notifications/mark-all-read")),
  destroy: secure((id: string) => api.delete<{ message: string }, AuthErrors>(`auth/notifications/${id}`)),
  destroyAll: secure(() => api.delete<{ deleted: number }, AuthErrors>("auth/notifications")),
})
