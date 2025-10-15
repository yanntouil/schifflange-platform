"use client"

import { A, D, G } from "@compo/utils"
import React from "react"
import { activeAppEl, disableAppEl, getAppElements, getAppName } from "../fns/elements"
import { storage } from "../fns/storage"
import { useCookieState } from "../hooks/useCookieState"
import { CookiesContext, CookiesContextType } from "./context"
import { CookieDeclaration } from "./types"

/**
 * This is a wrapper component that will provide the cookies context to all its children
 */
type CookiesProviderProps = {
  children: React.ReactNode
}
export const createCookieProvider = <CD extends CookieDeclaration>(
  declarations: CD
): {
  Provider: (props: CookiesProviderProps) => React.JSX.Element
  useCookies: () => CookiesContextType<CD>
} => {
  const initialConsent = A.reduce([...declarations.apps], {} as Record<string, boolean>, (acc, app) => ({
    ...acc,
    [app.name]: app.required || app.default,
  }))
  type CookieApp = CD["apps"][number]["name"]
  return {
    Provider: ({ children }) => {
      // State for the cookies stored in cookies
      const [consent, setConsent] = useCookieState(initialConsent, "cookie-consent")
      const [isConsented, setIsConsented] = useCookieState(false, "cookie-is-consented")

      // Accept all cookies
      const acceptAll = () => {
        setConsent(
          A.reduce(declarations.apps, {} as Record<CookieApp, boolean>, (acc, { name }) => ({
            ...acc,
            [name]: true,
          }))
        )
        setIsConsented(true)
      }

      // Reject all cookies
      const rejectAll = () => {
        setConsent(
          A.reduce(declarations.apps, {} as Record<CookieApp, boolean>, (acc, { name, required }) => ({
            ...acc,
            [name]: required,
          }))
        )
        setIsConsented(true)
      }

      // Check if an app can be used
      const canUse = React.useCallback((app: string) => consent[app] ?? false, [consent])

      // Manage preferences dialog
      const [preferences, setPreferences] = React.useState<boolean>(false)

      React.useEffect(() => {
        // Delete cookies that are not allowed
        A.forEach(declarations.apps, (app) => {
          if (consent[app.name] === true) {
            app.onAccept?.()
          } else if (consent[app.name] === false) {
            app.onReject?.()
            A.forEach(app.cookies ?? [], storage.cookie.delete)
            A.forEach(app.session ?? [], storage.session.delete)
            A.forEach(app.local ?? [], storage.local.delete)
          }
        })
        // Enable or disable scripts and iframes
        A.forEach(getAppElements(), (element) => {
          const app = getAppName(element)
          if (G.isNullable(app)) return
          if (D.get(consent, app)) activeAppEl(element)
          else disableAppEl(element)
        })
      }, [consent])

      return (
        <CookiesContext.Provider
          value={{
            consent,
            setConsent,
            acceptAll,
            rejectAll,
            canUse,
            setPreferences,
            preferences,
            isConsented,
            setIsConsented,
          }}
        >
          {children}
        </CookiesContext.Provider>
      )
    },
    useCookies: () => {
      const context = React.useContext(CookiesContext)
      if (context) return context
      throw new Error("useCookies must be used within a CookiesProvider")
    },
  }
}
