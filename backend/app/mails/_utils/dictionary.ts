import { A, D, G } from '@mobily/ts-belt'
import { localizeConfig } from './translation.js'

/**
 * make a path to the api
 */

/**
 * makeDictionary
 * make a dictionary from a translation object
 */
export const makeDictionary = (dictionary: Dictionary) => {
  const fn = (context: DictionaryContext, replacement: DictionaryReplacements = {}): string => {
    const result = resolveDictionaryPath(context, dictionary)
    if (G.isString(result)) return interpolateDictionaryString(result, replacement)
    const defaultValue = D.get(replacement, 'defaultValue')
    if (G.isString(defaultValue)) return defaultValue
    if (localizeConfig.debug) console.warn('Invalid dictionary path', context)
    return ''
  }
  fn.exist = (context: string) => resolveDictionaryPath(context, dictionary) !== ''
  fn.serialize = (context: string): Dictionary => {
    const result = resolveDictionaryPath(context, dictionary)
    if (!G.isString(result)) return {}
    if (localizeConfig.debug) console.warn('Invalid dictionary path', context)
    return {}
  }
  fn.prefixed = (prefix: string) => prefixed(fn, prefix)
  return fn
}

/**
 * types
 */
export type DictionaryFn = ReturnType<typeof makeDictionary>
export type DictionaryReplacements = Record<string, string | number>
export type DictionaryContext = string

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
  const contexts = path.split('.')
  return A.reduce(contexts, dict, (acc, key) => {
    if (G.isObject(acc)) return acc[key] as Dictionary
    return ''
  })
}

/**
 * interpolateDictionaryString
 * interpolate the dictionary string with the replacements
 */
const interpolateDictionaryString = (
  template: string,
  replacements: Record<string, string | number>
): string => {
  return A.reduce(D.toPairs(replacements), template, (str, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    return str.replace(regex, value.toString())
  })
}

/**
 * translateDefault
 * translate the default key
 */
const translateDefault = (
  _: string,
  options: DictionaryReplacements & { defaultValue: string } = { defaultValue: '' }
) => {
  return options.defaultValue
}
translateDefault.exist = (_: string) => false
export { translateDefault }

/**
 * types
 */
export type Dictionary = {
  [key: string]: string | Dictionary
}
