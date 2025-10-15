"use client"

import { CookiesProvider } from "@/components/cookies"
import { LocalizeLanguage, LocalizeProvider } from "@/lib/localize"
import { Primitives } from "@compo/primitives"
import React from "react"

type ProvidersProps = {
  language: LocalizeLanguage
  languages: LocalizeLanguage[]
  defaultLanguage: LocalizeLanguage
  noCookies?: boolean
}

export function Providers({
  children,
  language,
  languages,
  defaultLanguage,
  noCookies,
}: React.PropsWithChildren<ProvidersProps>) {
  if (noCookies) {
    return (
      <LocalizeProvider initialLanguage={language} languages={languages} defaultLanguage={defaultLanguage}>
        <Primitives.Tooltip.Provider>
          <React.Fragment>{children}</React.Fragment>
        </Primitives.Tooltip.Provider>
      </LocalizeProvider>
    )
  }
  return (
    <LocalizeProvider initialLanguage={language} languages={languages} defaultLanguage={defaultLanguage}>
      <CookiesProvider>
        <Primitives.Tooltip.Provider>
          <React.Fragment>{children}</React.Fragment>
        </Primitives.Tooltip.Provider>
      </CookiesProvider>
    </LocalizeProvider>
  )
}
