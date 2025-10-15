import { A, D, G, z } from "@compo/utils"
import { default as LanguageDetector } from "i18next-browser-languagedetector"
import { localizeConfig } from "./config"
import { Dictionary, DictionaryContext, DictionaryFn, DictionaryReplacements } from "./types"

/**
 * makeDictionary
 * make a dictionary from a translation object
 */
export const makeDictionary = (dictionary: Dictionary) => {
  const fn = (context: DictionaryContext, replacement: DictionaryReplacements = {}): string => {
    const result = resolveDictionaryPath(context, dictionary)
    if (G.isString(result)) return interpolateDictionaryString(result, replacement)
    const defaultValue = D.get(replacement, "defaultValue")
    if (G.isString(defaultValue)) return defaultValue
    if (localizeConfig.debug) console.warn("Invalid dictionary path", context)
    return ""
  }
  fn.exist = (context: string) => resolveDictionaryPath(context, dictionary) !== ""
  fn.serialize = (context: string): Dictionary => {
    const result = resolveDictionaryPath(context, dictionary)
    if (!G.isString(result)) return {}
    if (localizeConfig.debug) console.warn("Invalid dictionary path", context)
    return {}
  }
  fn.prefixed = (prefix: string) => prefixed(fn, prefix)
  return fn
}

/**
 * prefixed
 * prepend the prefix to the context
 */
export const prefixed = (fn: DictionaryFn, prefix: string) => {
  const prefixedFn = (ctx: DictionaryContext, replacements: DictionaryReplacements = {}) =>
    fn(`${prefix}.${ctx}`, replacements)
  prefixedFn.exist = (ctx: DictionaryContext) => fn.exist(`${prefix}.${ctx}`)
  prefixedFn.serialize = (ctx: DictionaryContext) => fn.serialize(`${prefix}.${ctx}`)
  prefixedFn.prefixed = (prefix: string) => prefixed(prefixedFn, prefix)
  return prefixedFn
}

/**
 * resolveDictionaryPath
 * resolve the dictionary path
 */
const resolveDictionaryPath = (path: string, dict: Dictionary | string): string | Dictionary => {
  const contexts = path.split(".")
  return A.reduce(contexts, dict, (acc, key) => {
    if (G.isObject(acc)) return acc[key] as Dictionary
    return ""
  })
}

/**
 * interpolateDictionaryString
 * interpolate the dictionary string with the replacements
 */
const interpolateDictionaryString = (template: string, replacements: Record<string, string | number>): string => {
  return A.reduce(D.toPairs(replacements), template, (str, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    return str.replace(regex, value.toString())
  })
}

/**
 * getDefaultLanguage
 * try to get the language from the navigator, if it's not supported, return the default language
 * https://www.npmjs.com/package/i18next-browser-languagedetector
 */
export const getDefaultLanguage = () => {
  try {
    const languageDetector = new LanguageDetector()
    languageDetector.init({
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    })
    return z.enum(localizeConfig.languages).parse(languageDetector.detect())
  } catch (e) {
    return localizeConfig.defaultLanguage
  }
}

/**
 * matchLanguage
 * match the language to the supported languages or return the default language
 */
export const matchLanguage = (language: unknown): (typeof localizeConfig.languages)[number] => {
  return G.isString(language) && A.includes([...localizeConfig.languages], language)
    ? (language as (typeof localizeConfig.languages)[number])
    : localizeConfig.defaultLanguage
}

/**
 * translateDefault
 * translate the default key
 */
const translateDefault = (
  key: string,
  options: DictionaryReplacements & { defaultValue: string } = { defaultValue: "" }
) => {
  return options.defaultValue
}
translateDefault.exist = (key: string) => false
export { translateDefault }
