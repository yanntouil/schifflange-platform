import { config } from "@/config"
import { service } from "@/service"
import { type LocalizeLanguage, matchLanguage as matchLanguageLocalize } from "@compo/localize"
import { A, D, G, match } from "@compo/utils"

/**
 * matchLanguage
 * match the language to the supported languages or return the default language
 */
export const matchLanguage = (language: unknown): (typeof config.languages)[number] => {
  return G.isString(language) && A.includes([...config.languages], language)
    ? (language as (typeof config.languages)[number])
    : config.defaultLanguage
}

/**
 * secureLocale
 * match the language to the supported languages or return the default language
 */
export const secureLocale = (locale: unknown): LocalizeLanguage => {
  return matchLanguageLocalize(locale)
}

/**
 * getLanguages
 * get the workspace languages from the service
 */
export const getLanguages = async () => {
  return match(await service.languages())
    .with({ ok: true }, ({ data }) => {
      const codes = A.map(data.languages, D.prop("code"))
      const defaultCode = A.find(data.languages, D.prop("default"))?.code || (A.head(codes) as string)
      return [defaultCode, codes] as const
    })
    .otherwise(() => [config.defaultLanguage, config.languages] as const) as readonly [
    LocalizeLanguage,
    LocalizeLanguage[],
  ]
}
