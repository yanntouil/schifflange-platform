import { notificationStore } from "@/features/notifications/store"
import React from "react"
import { useSonner } from "sonner"

/**
 * Hook to sync Sonner toasts with notification store
 * Automatically manages dismiss tracking based on active toasts
 */
export const useSonnerSync = () => {
  const { toasts } = useSonner()
  React.useEffect(() => {
    // Get current dismiss state
    const currentDismiss = notificationStore.current.dismiss

    // Get active toast IDs
    const activeToastIds = new Set(toasts.map((t) => t.id))

    // Find dismissed toasts (in store but not in active toasts)
    const dismissedIds = Object.entries(currentDismiss)
      .filter(([_, toastId]) => !activeToastIds.has(toastId))
      .map(([notificationId]) => notificationId)

    // Remove dismissed toast IDs from store
    if (dismissedIds.length > 0) {
      notificationStore.set((state) => {
        const newDismiss = { ...state.dismiss }
        dismissedIds.forEach((id) => delete newDismiss[id])
        return { ...state, dismiss: newDismiss }
      })
    }
  }, [toasts])
}
