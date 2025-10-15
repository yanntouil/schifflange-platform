/**
 * Number (n.) typed utils
 */

/**
 * isFiniteNumber
 */

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/**
 * parseNumber
 */

export const parseNumber = (value: unknown) => {
  return Number(value)
}

/**
 * makeNumber
 */

export const makeNumber = (value: unknown, fallback = 0): number => {
  const parsed = parseNumber(value)
  return isFiniteNumber(parsed) ? parsed : fallback
}
