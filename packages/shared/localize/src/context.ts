"use client"

import React from "react"
import { LocalizeLanguage } from "./types"

/**
 * type
 */
export type LocalizeContextType = {
  currentLanguage: LocalizeLanguage
  setLanguage: (lang: LocalizeLanguage) => void
  languages: readonly LocalizeLanguage[]
  isLocalizeLanguage: (language: string) => language is LocalizeLanguage
}

/**
 * context
 */
export const LocalizeContext = React.createContext<LocalizeContextType | null>(null)

/**
 * hook
 */
export const useLocalize = (): LocalizeContextType => {
  const context = React.useContext(LocalizeContext)
  if (!context) {
    throw new Error("useLocalize must be used within a LocalizeProvider")
  }
  return context
}
