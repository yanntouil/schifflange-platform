import { Api } from "@/services"
import { A, D } from "@compo/utils"
import { toast } from "sonner"
import { notificationStore } from "."

/**
 * setConnected
 * set the connected state
 */
export const setConnected = (connected: boolean) => notificationStore.set({ isConnected: connected })

/**
 * appendDismiss
 * append a dismiss to the store (atomic update to prevent race conditions)
 */
export const appendDismiss = (id: string, toastId: string | number) =>
  notificationStore.set((state) => ({
    ...state,
    dismiss: { ...state.dismiss, [id]: toastId },
  }))

/**
 * removeDismiss
 * remove a dismiss from the store
 */
export const removeDismiss = (id: string) =>
  notificationStore.set((state) => ({
    ...state,
    dismiss: D.rejectWithKey(state.dismiss, (key) => key === id) as Record<string, string | number>, // rejectWithKey bring a Partial
  }))

/**
 * appendNotification
 * append a notification to the store if it doesn't exist and update unread count
 */
export const appendNotification = (notification: Api.Notification) =>
  notificationStore.set((state) => {
    const exists = A.find(state.notifications, (n) => n.id === notification.id)
    const notifications = exists
      ? A.map(state.notifications, (n) => (n.id === notification.id ? notification : n))
      : A.prepend(state.notifications, notification)
    const unreadCount = A.filter(notifications, (n) => n.status === "unread").length
    return {
      ...state,
      notifications,
      unreadCount,
    }
  })

/**
 * markAsRead
 * mark a notification as read and update unread count
 */
export const markAsRead = (notificationId: string) =>
  notificationStore.set((state) => {
    const notifications = A.map(state.notifications, (n) => (n.id === notificationId ? D.set(n, "status", "read") : n))
    const unreadCount = A.filter(state.notifications, (n) => n.status === "unread").length
    let dismiss = state.dismiss
    const toastId = dismiss[notificationId]
    if (toastId) {
      toast.dismiss(toastId)
      dismiss = D.rejectWithKey(dismiss, (key) => key === notificationId) as Record<string, string | number>
    }
    return {
      ...state,
      dismiss,
      notifications,
      unreadCount,
    }
  })

/**
 * markAllAsRead
 * mark all notifications as read and update unread count
 */
export const markAllAsRead = () =>
  notificationStore.set((state) => {
    for (const toastId of D.values(state.dismiss)) {
      toast.dismiss(toastId)
    }
    return {
      ...state,
      notifications: A.map(state.notifications, D.set("status", "read")),
      unreadCount: 0,
      dismiss: {},
    }
  })

/**
 * removeNotification
 * remove a notification from the store and update unread count
 */
export const removeNotification = (notificationId: string) =>
  notificationStore.set((state) => {
    const notifications = A.filter(state.notifications, (n) => n.id !== notificationId)
    const unreadCount = A.filter(notifications, (n) => n.status === "unread").length
    let dismiss = state.dismiss
    const toastId = dismiss[notificationId]
    if (toastId) {
      toast.dismiss(toastId)
      dismiss = D.rejectWithKey(dismiss, (key) => key === notificationId) as Record<string, string | number>
    }
    return {
      ...state,
      notifications,
      unreadCount,
    }
  })

/**
 * loadNotifications
 * load notifications into the store
 */
export const loadNotifications = (notifications: Api.Notification[]) =>
  notificationStore.set({
    notifications,
    unreadCount: notifications.filter((n) => n.status === "unread").length,
  })
