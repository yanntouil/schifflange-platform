import { A, G, O, pipe, S } from '@mobily/ts-belt'

/**
 * normString
 * Normalize a string
 * @param term
 * @returns
 */
export const normString = (term: string) =>
  term
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,/"#!$%^&*;:{}=\-_`~()]/g, '')

/**
 * makeTerms
 * Make terms from a search string
 * @param search
 * @returns
 */
export const makeTerms = (search: string) =>
  pipe(
    search,
    S.trim,
    S.toLowerCase,
    S.split(' '),
    A.filterMap((term) => {
      if (G.isString(term)) {
        const normTerm = normString(term)
        if (S.isNotEmpty(normTerm)) {
          return O.Some(normTerm)
        }
      }
      return O.None
    })
  )

/**
 * makeUnNormalizedTerms
 * Make terms from a search string without normalizing them (keep each special characters)
 * @param search
 * @returns
 */
export const makeUnNormalizedTerms = (search: string) =>
  pipe(
    search,
    S.trim,
    S.toLowerCase,
    S.split(' '),
    A.filterMap((term) => {
      if (G.isString(term)) {
        if (S.isNotEmpty(term)) {
          return O.Some(term)
        }
      }
      return O.None
    })
  )

/**
 * return a placeholder if the value is empty
 * @param value
 * @param placeholder
 * @returns
 */
export const placeholder = <T extends string | undefined, U extends string | undefined>(
  value: U,
  placeholder?: T
): NonNullable<U> | (T extends string ? T : null) => {
  if (G.isNotNullable(value) && S.isNotEmpty(S.trim(value ?? ''))) return value
  if (G.isNotNullable(placeholder)) return placeholder as T extends string ? T : null
  return null as T extends string ? T : null
}

/**
 * Pads a string value with leading zeroes until length is reached
 * @example zeroPad(8, 3) => "008"
 * @param value
 * @param length
 * @returns
 */
export const zeroPad = (value: string | number, length = 2): string =>
  `${value}`.padStart(length, '0')
