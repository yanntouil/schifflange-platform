"use client"

import { LocalizeLanguage, makeDictionary, type Dictionary } from "@compo/localize"
import { A, D, deDE, enGB, frFR, match, T } from "@compo/utils"
import React from "react"

/**
 * type
 */
// export type LocalizeLanguage = (typeof config.languages)[number]
export type { LocalizeLanguage }
type LocalizeContextType = {
  currentLanguage: string
  languages: LocalizeLanguage[]
}
export type Translation = Record<LocalizeLanguage, Dictionary> & Record<string, Dictionary>

/**
 * context
 */
const LocalizeContext = React.createContext<LocalizeContextType | null>(null)

/**
 * hook
 */
const useLocalize = (): LocalizeContextType => {
  const context = React.useContext(LocalizeContext)
  if (!context) {
    throw new Error("useLocalize must be used within a LocalizeProvider")
  }
  return context
}

/**
 * provider
 */
export const LocalizeProvider: React.FC<
  React.PropsWithChildren<{
    initialLanguage: LocalizeLanguage
    languages: LocalizeLanguage[]
    defaultLanguage: LocalizeLanguage
  }>
> = ({ children, initialLanguage, languages }) => {
  // update the language on the document element
  React.useEffect(() => {
    document.documentElement.lang = initialLanguage
  }, [initialLanguage])

  return (
    <LocalizeContext.Provider
      value={{
        currentLanguage: initialLanguage,
        languages: languages,
      }}
    >
      {children}
    </LocalizeContext.Provider>
  )
}

/**
 * useTranslation
 */
export const useTranslation = (translation?: Translation, translateIn?: string) => {
  const { currentLanguage, ...rest } = useLocalize()

  const language = React.useMemo(
    () => A.find([...rest.languages], (language) => language === translateIn) ?? currentLanguage,
    [translateIn, currentLanguage, rest.languages]
  )

  const dictionary = (translation && D.get(translation, language)) ?? {}
  const _ = makeDictionary(dictionary)

  // set the locale from the language
  const locale = React.useMemo(
    () =>
      match(language)
        .with("fr", () => frFR)
        .with("de", () => deDE)
        .otherwise(() => enGB),
    [language]
  )

  // prepare the format function with the current locale
  const format = React.useCallback(
    (date: T.DateArg<Date>, format: string, option: T.FormatOptions = {}) =>
      T.format(date, format, { locale, ...option }),
    [locale]
  )
  const formatDistance = React.useCallback(
    (relativeDate: T.DateArg<Date>, date: T.DateArg<Date> = new Date(), affix: boolean = true) => {
      return T.formatDistance(relativeDate, date, {
        locale,
        addSuffix: true,
      })
    },
    [locale]
  )

  return { _, language, locale, format, formatDistance, ...rest }
}
