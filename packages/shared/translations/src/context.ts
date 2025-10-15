import { type Api } from "@services/dashboard"
import React from "react"

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * LanguagesContext
 */

/**
 * type
 */
export type LanguagesContextType = {
  languages: Api.Language[]
  current: Api.Language
}

/**
 * context
 */
export const LanguagesContext = React.createContext<LanguagesContextType | null>(null)

/**
 * hook
 */
export const useLanguagesContext = () => {
  const context = React.useContext(LanguagesContext)
  if (!context) throw new Error("useLanguagesContext must be used within a LanguagesProvider")
  return context
}

/** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
 * ContextualLanguageContext
 */

/**
 * type
 */
export type ContextualLanguageContextType = {
  current: Api.Language
  setCurrent: (language: Api.Language) => void
}

/**
 * context
 */
export const ContextualLanguageContext = React.createContext<ContextualLanguageContextType | null>(null)

/**
 * hook
 */
export const useContextualLanguageContext = () => {
  const context = React.useContext(ContextualLanguageContext)
  if (!context) throw new Error("useContextualLanguageContext must be used within a ContextualLanguageProvider")
  return context
}
