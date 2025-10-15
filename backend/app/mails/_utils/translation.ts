import { D } from '@mobily/ts-belt'
import * as T from 'date-fns'
import { de, enGB, fr } from 'date-fns/locale'
import { match } from 'ts-pattern'
import { Dictionary, DictionaryContext, makeDictionary } from './dictionary.js'

/**
 * localizeConfig
 * configuration for the localization
 */
export const localizeConfig = {
  defaultLanguage: 'fr',
  languages: ['en', 'fr'],
  debug: false,
} as const

/**
 * getTranslation
 * server side hook to use the translation (not a real hook)
 */
export const getTranslation = (translation: Translation, currentLanguage: string) => {
  // prepare the dictionary from the translation
  const dictionary = (translation && D.get(translation, currentLanguage as LocalizeLanguage)) ?? {}
  const _ = makeDictionary(dictionary)

  // set the locale from the language
  const locale = match(currentLanguage)
    .with('fr', () => fr)
    .with('lu', () => fr)
    .with('de', () => de)
    .otherwise(() => enGB)

  // prepare the format function with the current locale
  const format = (date: T.DateArg<Date>, format: string, option: T.FormatOptions = {}) =>
    T.format(date, format, { locale, ...option })
  const formatDistance = (
    relativeDate: T.DateArg<Date>,
    date: T.DateArg<Date> = new Date(),
    addSuffix: boolean = true
  ) => {
    return T.formatDistance(relativeDate, date, {
      locale,
      addSuffix,
    })
  }

  return { _, language: currentLanguage, locale, format, formatDistance }
}

/**
 * translate
 * translate a context into the current language
 */
export const translate = (
  context: DictionaryContext,
  translation: Translation,
  currentLanguage: string
) => {
  const { _ } = getTranslation(translation, currentLanguage)
  return _(context)
}

/**
 * types
 */
export type LocalizeConfig = typeof localizeConfig
export type LocalizeLanguage = (typeof localizeConfig)['languages'][number]
export type DefaultLanguage = (typeof localizeConfig)['defaultLanguage']
export type Translation = Record<LocalizeLanguage, Dictionary>
