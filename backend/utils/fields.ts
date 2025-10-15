import { ExtraField } from '#models/user-profile'

/**
 * compareExtraFieldChanges
 * Compares two arrays of ExtraField objects and returns true if they are equal
 * @param a - The first array of ExtraField objects
 * @param b - The second array of ExtraField objects
 * @returns True if the arrays are equal, false otherwise
 */
export const compareExtraFieldChanges = (a: ExtraField[], b: ExtraField[]) => {
  if (a.length !== b.length) return false

  const sortFn = (x: ExtraField) => `${x.name}:${x.value}`
  const sortedA = [...a].map(sortFn).sort()
  const sortedB = [...b].map(sortFn).sort()

  return sortedA.every((val, i) => val === sortedB[i])
}
