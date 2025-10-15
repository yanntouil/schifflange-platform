import { localizeConfig, onEachTranslation, Translation, useTranslation } from "@compo/localize"
import { A, G, Option, S } from "@compo/utils"
import { Api } from "@services/dashboard"
import React from "react"
import { useContextualLanguageContext, useLanguagesContext } from "./context"
import { dictionary as languagesDictionary } from "./dictionary"

/**
 * useLanguages
 * alias of useLanguagesContext
 */
export const useLanguages = useLanguagesContext

/**
 * useLanguage
 * assert that the current language from the list of languages
 */
export const useLanguage = (dictionary: Translation = onEachTranslation({ [localizeConfig.defaultLanguage]: {} })) => {
  const { current, languages } = useLanguages()
  const others = React.useMemo(
    () => A.filter(languages, (language) => language.code !== current.code),
    [current, languages]
  )

  // Type of the translate function, including its `.language` helper
  type TranslateFn = {
    <L extends { languageId: string }, P extends Partial<L>>(
      item: Api.Translatable<L>,
      placeholder: P
    ): P & { languageId: string }

    language: (
      languageId: string
    ) => <L extends { languageId: string }, P extends Partial<L>>(
      item: Api.Translatable<L>,
      placeholder: P
    ) => P & { languageId: string }
  }

  // translate: secure a translation using `placeholder` as the safe shape
  const translate: TranslateFn = (<L extends { languageId: string }, P extends Partial<L>>(
    item: Api.Translatable<L>,
    placeholder: P
  ): P & { languageId: string } => {
    const existing = A.find(item.translations ?? [], ({ languageId }) => languageId === current.id)

    // merge preserves placeholder defaults, then overlays existing translation if found
    const base = existing ? { ...placeholder, ...existing } : { ...placeholder }
    const result = {
      ...base,
      languageId: existing?.languageId ?? current.id,
    } as P & { languageId: string }

    return result
  }) as TranslateFn

  // translate for a specific language id
  translate.language =
    (languageId: string) =>
    <L extends { languageId: string }, P extends Partial<L>>(
      item: Api.Translatable<L>,
      placeholder: P
    ): P & { languageId: string } => {
      const existing = A.find(item.translations ?? [], ({ languageId: id }) => id === languageId)

      const base = existing ? { ...placeholder, ...existing } : { ...placeholder }
      const result = {
        ...base,
        languageId: existing?.languageId ?? languageId,
      } as P & { languageId: string }

      return result
    }

  // return a lang attribute if the value is not empty
  const langIfNotEmpty = (value: Option<string>): string | undefined =>
    G.isNotNullable(value) && S.isNotEmpty(S.trim(value)) ? current.code : undefined

  const { _: t } = useTranslation(languagesDictionary)
  const { _ } = useTranslation(dictionary, current.code)

  return { languages, current, others, translate, t, _, langIfNotEmpty }
}

/**
 * useContextualLanguage
 * assert that the current language from the list of languages
 */

export const useContextualLanguage = (
  dictionary: Translation = onEachTranslation({ [localizeConfig.defaultLanguage]: {} })
): ReturnType<typeof useLanguage> & {
  setCurrent: (language: Api.Language) => void
} => {
  const { current, setCurrent } = useContextualLanguageContext()
  const { languages } = useLanguages()

  const others = React.useMemo(
    () => A.filter(languages, (language) => language.code !== current.code),
    [current, languages]
  )
  // Type of the translate function, including its `.language` helper
  type TranslateFn = {
    <L extends { languageId: string }, P extends Partial<L>>(
      item: Api.Translatable<L>,
      placeholder: P
    ): P & { languageId: string }

    language: (
      languageId: string
    ) => <L extends { languageId: string }, P extends Partial<L>>(
      item: Api.Translatable<L>,
      placeholder: P
    ) => P & { languageId: string }
  }
  // translate: secure a translation using `placeholder` as the safe shape
  const translate: TranslateFn = (<L extends { languageId: string }, P extends Partial<L>>(
    item: Api.Translatable<L>,
    placeholder: P
  ): P & { languageId: string } => {
    try {
      const existing = A.find(item.translations ?? [], ({ languageId }) => languageId === current.id)
      // merge preserves placeholder defaults, then overlays existing translation if found
      const base = existing ? { ...placeholder, ...existing } : placeholder
      const result = {
        ...base,
        languageId: existing?.languageId ?? current.id,
      } as P & { languageId: string }

      return result
    } catch (e) {
      console.info(e)
    }
    return {
      ...placeholder,
      languageId: current.id,
    } as P & { languageId: string }
  }) as TranslateFn

  // translate for a specific language id
  translate.language =
    (languageId: string) =>
    <L extends { languageId: string }, P extends Partial<L>>(
      item: Api.Translatable<L>,
      placeholder: P
    ): P & { languageId: string } => {
      try {
        const existing = A.find(item.translations ?? [], ({ languageId: id }) => id === languageId)

        const base = existing ? { ...placeholder, ...existing } : placeholder
        const result = {
          ...base,
          languageId: existing?.languageId ?? languageId,
        } as P & { languageId: string }

        return result
      } catch (e) {
        console.info(e)
      }
      return {
        ...placeholder,
        languageId: current.id,
      } as P & { languageId: string }
    }

  // return a lang attribute if the value is not empty
  const langIfNotEmpty = (value: Option<string>): string | undefined =>
    G.isNotNullable(value) && S.isNotEmpty(S.trim(value)) ? current.code : undefined

  const { _: t } = useTranslation(languagesDictionary)

  const { _ } = useTranslation(dictionary, current.code)

  return { languages, current, setCurrent, others, translate, t, _, langIfNotEmpty }
}

export type TranslateFn = ReturnType<typeof useLanguage>["translate"]
