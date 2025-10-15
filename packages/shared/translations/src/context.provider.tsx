import { usePersistedState } from "@compo/hooks"
import { useLocalize } from "@compo/localize"
import { A, G, z } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { ContextualLanguageContext, LanguagesContext, useLanguagesContext } from "./context"

/**
 * LanguagesProvider
 * main provider for the languages service, this provider must be wrap in a LocalizeProvider to work
 */
export type LanguagesProviderProps = React.PropsWithChildren & {
  fallbackLanguage: string
  languages: Api.Language[]
}
export const LanguagesProvider: React.FC<LanguagesProviderProps> = ({ children, languages, fallbackLanguage }) => {
  // get the current language from the localize context
  const { currentLanguage } = useLocalize()
  const current = React.useMemo(() => {
    // try to find the current language in the list of languages
    const found = A.find(languages, (language) => language.code === currentLanguage)
    if (G.isNotNullable(found)) return found

    // try to find the fallback language in the list of languages
    const foundFallback = A.find(languages, (language) => language.code === fallbackLanguage)
    if (G.isNotNullable(foundFallback)) return foundFallback

    // assert that the fallback language is in the list of languages (must never happen)
    throw new Error(
      `${currentLanguage} as current language and ${fallbackLanguage} as fallback language are not found in the list of languages`
    )
  }, [currentLanguage, languages, fallbackLanguage])

  return (
    <LanguagesContext.Provider
      value={{
        languages,
        current,
      }}
    >
      {children}
    </LanguagesContext.Provider>
  )
}

/**
 * ContextualLanguageProvider
 * Create a provider for the contextual language use to translate content in specific wrapper
 */
export type ContextualLanguageProviderProps = React.PropsWithChildren & {
  current?: Api.Language
  persistedId: string
}
export const ContextualLanguageProvider: React.FC<ContextualLanguageProviderProps> = ({
  children,
  persistedId,
  ...props
}) => {
  const { languages, ...ctx } = useLanguagesContext()
  const defaultLanguage = props.current ?? ctx.current

  // create state from the current props or the current language by default
  const [currentId, setCurrentId] = usePersistedState<string>(
    defaultLanguage.id,
    persistedId,
    z.string(),
    sessionStorage
  )

  // find the current language by id in the list of languages
  const current = React.useMemo(
    () => A.find(languages, (language) => language.id === currentId) ?? defaultLanguage,
    [currentId, languages, defaultLanguage]
  )

  // set the current language by id
  const setCurrent = (language: Api.Language) => setCurrentId(language.id)

  return (
    <ContextualLanguageContext.Provider value={{ current, setCurrent }}>{children}</ContextualLanguageContext.Provider>
  )
}
