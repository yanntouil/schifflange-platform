/**
 * makeNumberOrFallback
 */
export const makeNumberOrFallback = (value: unknown, fallback: number) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value !== '' && !isNaN(Number(value))) return Number(value)
  return fallback
}
