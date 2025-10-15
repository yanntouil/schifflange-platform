import { useNotifications } from "@/features/notifications/hooks/use-notifications"
import { useSonnerSync } from "@/features/notifications/hooks/use-sonner-sync"
import React from "react"

/**
 * AppProvider
 * wrapper for the app
 */
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize notifications system
  useNotifications()
  // Sync toasts with store
  useSonnerSync()

  return <React.Fragment>{children}</React.Fragment>
}
