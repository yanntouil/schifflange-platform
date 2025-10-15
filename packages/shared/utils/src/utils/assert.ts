/**
 * Nullable assertions
 * runtime typescript non-nullable assertion
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html
 */

export const assert = <V>(value: V, error: Error | string = new Error("Non-nullable assertion failed")) => {
  if (isNullable(value)) {
    if (typeof error === "string") throw new Error(error)
    throw error
  }
  return value!
}

export const assertNonNullable = <V>(value: V) => {
  if (!isNullable(value)) throw new Error("Nullable assertion failed")
  return value
}

export const assertAwaited = async <V>(data: Promise<V>) => {
  return assert(await data)
}

/**
 * Internal nullable guard
 */

export const isNullable = <V>(value: V): value is NonNullable<V> => value === undefined || value === null
