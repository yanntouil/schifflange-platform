import globalConfig from "@/config/global"
import { makeAuthDependStore } from "@/features/auth"
import { Api } from "@/services"
import { create } from "zustand"
import { decorateStore } from "../../../utils/zustand"
import * as actions from "./actions"

/**
 * types
 */
type NotificationState = {
  key: string | null
  notifications: Api.Notification[]
  dismiss: Record<string, string | number>
  unreadCount: number
  isConnected: boolean
}

/**
 * initial state
 */
export const initialState: NotificationState = {
  key: null,
  notifications: [],
  dismiss: {},
  unreadCount: 0,
  isConnected: false,
}

/**
 * store
 */
export const notificationStore = decorateStore(
  initialState,
  create,
  {
    devtools: {
      name: "notifications-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  actions
)

/**
 * auth dependent store
 */
export const useNotificationStore = makeAuthDependStore(notificationStore.use, (key) =>
  notificationStore.set(() => ({ ...initialState, key }))
)
