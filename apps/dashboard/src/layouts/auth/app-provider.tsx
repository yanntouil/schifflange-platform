import { useNotifications } from "@/features/notifications/hooks/use-notifications"
import { useSonnerSync } from "@/features/notifications/hooks/use-sonner-sync"
import { localizeConfig } from "@compo/localize"
import { LanguagesProvider as LanguagesProviderBase, useLanguagesStore } from "@compo/translations"
import React from "react"

/**
 * AuthAppProvider
 * This provider is used to provide the languages and the notifications system to the application when the user is authenticated
 */
export const AuthAppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // provide languages
  const { languages } = useLanguagesStore()
  // Initialize notifications system
  useNotifications()
  // Sync toasts with store
  useSonnerSync()
  return (
    <LanguagesProviderBase fallbackLanguage={localizeConfig.defaultLanguage} languages={languages}>
      {children}
    </LanguagesProviderBase>
  )
}
