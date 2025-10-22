/*
|--------------------------------------------------------------------------
| string utils
|--------------------------------------------------------------------------
|
| The string utils is used for defining the string utils.
|
*/

import { A, B, G, Option, S, flow, pipe } from "@mobily/ts-belt"

/**
 * localeCompare
 */
export const localeCompare = (a: string, b: string) => a.localeCompare(b)

/**
 * Pads a string value with leading zeroes until length is reached
 * @example zeroPad(8, 3) => "008"
 */
export const zeroPad = (value: string | number, length = 2): string => `${value}`.padStart(length, "0")

/**
 * prependHttp
 */
export const prependHttp = (url: string, https = true): string => {
  if (/^\.*\/|^(?!localhost)\w+?:/.test(url.trim())) return url.trim()
  return url.trim().replace(/^(?!(?:\w+?:)?\/\/)/, https ? "https://" : "http://")
}
/**
 * string conversion
 */
export const camelToSnake = (str: string) => str.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())
export const camelToKebab = (str: string) => str.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
export const camalize = (string: string): string =>
  string.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_match, char) => char.toUpperCase())

/**
 * remove https
 */
export const readableURL = S.replaceByRe(/(^\w+:|^)\/\//, "")

/**
 * capitalize the first character of a string
 */
export const capitalize = (s: string) => `${S.toUpperCase(S.slice(s, 0, 1))}${S.sliceToEnd(s, 1)}`

/**
 * alias of capitalize for php old school developers :)
 */
export const ucFirst = capitalize

/**
 * pluralize
 */
export const pluralize = (n: number, word: string, none?: string, replace?: boolean) =>
  n === 0 ? (replace ? none : `${none ?? ""} ${word}`) : n === 1 ? `${n} ${word}` : `${n} ${word}s`

/**
 * incrementName
 */
export const incrementName = (name: string, existingNames: string[]) => {
  if (existingNames.length === 0) return name
  const numbers = existingNames.map((name) => +name.replace(/[^0-9]/g, ""))
  const nextNumber = Math.max(0, ...numbers) + 1
  const repName = name.replace(/[0-9]/g, "")
  return `${repName} ${nextNumber}`
}

/**
 * makeBreakable
 */
export const makeBreakable = (str: string, interval = 5): string =>
  str.replace(new RegExp(`(.{${interval}})`, "g"), `$1\u200B`)

/**
 * truncateText
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) return text.substring(0, maxLength) + "..."
  return text
}

/**
 * truncateMiddle
 */
export const truncateMiddle = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  const charsToShow = maxLength - 3 // 3 pour les points de suspension
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return text.substring(0, frontChars) + "..." + text.substring(text.length - backChars)
}

/**
 * return a placeholder if the value is empty
 */
export const placeholder = <T extends string | undefined, U extends string | undefined>(
  value: U,
  placeholder?: T
): U | (T extends undefined ? null : T) => {
  if (G.isNotNullable(value) && S.isNotEmpty(S.trim(value ?? ""))) return value as U
  if (G.isNotNullable(placeholder)) return placeholder as T extends undefined ? null : T
  return null as T extends undefined ? null : T
}

/**
 * slugify
 */
export const slugify = (value: string) => {
  const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;"
  const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------"
  const p = new RegExp(a.split("").join("|"), "g")

  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

/**
 * oneIsNotEmpty
 * Check if at least one string is not empty
 */
export const oneIsNotEmpty = (...strings: Option<string>[]) =>
  A.some(strings, flow(S.make, S.trim, S.isEmpty, B.inverse))

/**
 * isNotEmptyString
 * Check if a string is not an empty
 */
export const isNotEmptyString = (s: Option<string>): s is string =>
  G.isNotNullable(s) && pipe(s, S.make, S.trim, S.isEmpty, B.inverse)

/**
 * everyAreNotEmpty
 * Check if all strings are not empty
 */
export const everyAreNotEmpty = (...strings: Option<string>[]) =>
  A.every(strings, flow(S.make, S.trim, S.isEmpty, B.inverse))

/**
 * stripHtml
 * Remove HTML tags from a string
 */
export const stripHtml = (s: string) => s.replace(/(<([^>]+)>)/gi, "")

/**
 * getInitials
 * Get the initials of a firstname and a lastname, prioritize the firstname initials with first lastname initials
 */
const splitWords = (s: string): string[] =>
  s
    .trim()
    .split(/[\s\-']+/)
    .filter(Boolean)
export const getInitials = (firstName: string, lastName: string, maxLength = 2): string => {
  const firstnames = splitWords(firstName)
  const lastnames = splitWords(lastName)
  const firstnameInitials = firstnames
    .map((name) => name[0])
    .join("")
    .toUpperCase()
  const lastnameInitials = lastnames
    .map((name) => name[0])
    .join("")
    .toUpperCase()
  if (firstnameInitials.length >= maxLength - 1) {
    if (lastnameInitials.length === 0) {
      return firstnameInitials.slice(0, maxLength)
    }
    return firstnameInitials.slice(0, maxLength - 1) + lastnameInitials[0]
  }
  const firstInitials = firstnameInitials.slice(0, maxLength - 1)
  const lastInitials = lastnameInitials.slice(0, maxLength - firstInitials.length)
  const initials = firstInitials + lastInitials
  return initials.slice(0, maxLength)
}

/**
 * trimSpaces
 * leave only one space between words
 */
export const trimSpaces = (s: string) => s.replace(/\s+/g, " ").trim()
