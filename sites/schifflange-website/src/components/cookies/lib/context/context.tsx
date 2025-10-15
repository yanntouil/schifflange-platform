"use client"

import React from "react"
import { CookieDeclaration } from "./types"

/**
 * Context for the cookies
 */
export const CookiesContext = React.createContext<CookiesContextType | null>(null)
export const useCookies = () => {
  const context = React.useContext(CookiesContext)
  if (!context) throw new Error("useCookies must be used within a CookiesProvider")
  return context
}

/**
 * types
 */
export type CookiesContextType<
  CD extends CookieDeclaration = CookieDeclaration,
  App extends string = CD["apps"][number]["name"],
> = {
  consent: Record<App, boolean>
  setConsent: React.Dispatch<React.SetStateAction<Record<App, boolean>>>
  acceptAll: () => void
  rejectAll: () => void
  canUse: (app: App) => boolean
  preferences: boolean
  setPreferences: (preferences: boolean) => void
  isConsented: boolean
  setIsConsented: React.Dispatch<React.SetStateAction<boolean>>
}
