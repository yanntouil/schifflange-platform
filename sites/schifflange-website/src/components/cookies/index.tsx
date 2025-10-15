"use client"

import { ConsentDialog } from "./components/dialogs/consent"
import { ManagePreferences } from "./components/dialogs/manage-preferences"
import { cookieDeclarations } from "./config"
import { createCookieProvider } from "./lib"

export const { Provider, useCookies } = createCookieProvider(cookieDeclarations)
export type CookieDeclaration = typeof cookieDeclarations
export type CookieApp = CookieDeclaration["apps"][number]["name"]
export type CookieCategory = CookieDeclaration["categories"][number]
export const CookiesProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <Provider>
      {children}
      <ConsentDialog />
      <ManagePreferences />
    </Provider>
  )
}
