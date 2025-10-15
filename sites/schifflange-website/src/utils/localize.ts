import { config } from "@/config"
import { Dictionary, makeDictionary } from "@compo/localize"
import { D, enGB, fr, match, T } from "@compo/utils"

type LocalizeLanguage = (typeof config.languages)[number]
type Translation = Record<LocalizeLanguage, Dictionary> & Record<string, Dictionary>

/**
 * getServerTranslation
 */
export const getServerTranslation = (currentLanguage: string, translation?: Translation) => {
  // prepare the dictionary from the translation
  const dictionary = (translation && D.get(translation, currentLanguage)) ?? {}
  const _ = makeDictionary(dictionary)

  // set the locale from the language
  const locale = match(currentLanguage)
    .with("fr", () => fr)
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
  return {
    _,
    language: currentLanguage,
    format,
    formatDistance,
    languages: config.languages,
  }
}
