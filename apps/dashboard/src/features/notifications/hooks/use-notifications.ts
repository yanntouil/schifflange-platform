import { notificationToast } from "@/features/notifications/components/toast"
import { notificationStore, useNotificationStore } from "@/features/notifications/store"
import { transmit } from "@/lib/transmit"
import { Api } from "@/services"
import React from "react"

const { setConnected, appendNotification, markAsRead, markAllAsRead, removeNotification, appendDismiss } = notificationStore.actions

/**
 * Hook to manage real-time notifications via SSE
 */
export const useNotifications = () => {
  const { notifications, unreadCount, isConnected, key } = useNotificationStore()

  const subscriptionRef = React.useRef<any>(null)

  React.useEffect(() => {
    const connectToNotifications = async () => {
      if (!key) return
      try {
        // Create subscription to user's notification channel
        const subscription = transmit.subscription(`notification|${key}`)

        // Store reference for cleanup
        subscriptionRef.current = subscription

        // Create the subscription
        await subscription.create()

        // Listen for incoming notifications
        subscription.onMessage((notification: Api.Notification) => {
          appendNotification(notification)
          // Show toast for new notification
          const toastId = notificationToast(notification)
          appendDismiss(notification.id, toastId)
        })

        setConnected(true)
        console.log(`🔌 Connected to notifications for user ${key}`)
      } catch (error) {
        console.error("Failed to connect to notifications:", error)
        setConnected(false)
      }
    }

    connectToNotifications()

    // Cleanup on unmount or user change
    return () => {
      if (subscriptionRef.current) {
        console.log("🔌 Disconnecting from notifications")
        subscriptionRef.current = null
        setConnected(false)
      }
    }
  }, [key])

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }
}
