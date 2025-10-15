import { A, D, enGB, frFR, match, T } from '@compo/utils'
import React from 'react'
import { localizeConfig } from './config'
import { useLocalize } from './context'
import { DefaultLanguage, Dictionary, Translation } from './types'
import { makeDictionary } from './utils'

/**
 * useTranslation
 */
export const useTranslation = (translation?: Translation, translateIn?: string) => {
  const { currentLanguage, ...rest } = useLocalize()

  const language = React.useMemo(
    () => A.find([...rest.languages], language => language === translateIn) ?? currentLanguage,
    [translateIn, currentLanguage, rest.languages]
  )

  const dictionary = (translation && D.get(translation, language)) ?? {}
  const _ = makeDictionary(dictionary)

  // set the locale from the language
  const locale = React.useMemo(
    () =>
      match(language)
        .with('fr', () => frFR)
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

/**
 * onEachTranslation
 * replace by the default translation each translation does not exist
 * this help must only be used to wrap the translation in development
 * please remove it before release
 * @deprecated
 */
export const onEachTranslation = (translation: Record<string | DefaultLanguage, Dictionary>) => {
  const defaultTranslation = translation[localizeConfig.defaultLanguage]
  return A.reduce([...localizeConfig.languages], {} as Translation, (acc, lang) =>
    D.set(acc, lang, D.get(translation, lang) ?? defaultTranslation)
  )
}
