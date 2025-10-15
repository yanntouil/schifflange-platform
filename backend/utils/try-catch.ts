/**
 * tryCatchSync
 * try or return error sync
 */
export const tryCatchSync = <R, E, A extends any[]>(
  fn: (...args: A) => R,
  ...args: A
): [null, R] | [E, undefined] => {
  try {
    return [null, fn(...args)]
  } catch (error) {
    return [error as E, undefined]
  }
}

/**
 * tryOrFalse
 */
export const tryOrFalse = <R, A extends any[]>(fn: (...args: A) => R, ...args: A): R | false => {
  try {
    return fn(...args)
  } catch (error) {
    return false
  }
}

/**
 * tryOrNull
 */
export const tryOrNull = <R, A extends any[]>(fn: (...args: A) => R, ...args: A): R | null => {
  try {
    return fn(...args)
  } catch (error) {
    return null
  }
}

/**
 * tryOrNull
 */
export const tryOrUndefined = async <R, A extends any[]>(
  fn: (...args: A) => Promise<R>,
  ...args: A
): Promise<R | undefined> => {
  try {
    return await fn(...args)
  } catch (error) {
    return undefined
  }
}
export const tryOrUndefinedSync = <R, A extends any[]>(
  fn: (...args: A) => R,
  ...args: A
): R | undefined => {
  try {
    return fn(...args)
  } catch (error) {
    return undefined
  }
}

/**
 * tryCatch
 */
export const tryCatch = async <R, E extends Error>(
  fn: () => Promise<R>
): Promise<[E, undefined] | [null, R]> => {
  try {
    return [null, await fn()]
  } catch (error) {
    return [error as E, undefined]
  }
}
/**
 * tryThrow
 */
export const tryThrow = async <R, Error>(promise: () => Promise<R>, error: Error): Promise<R> =>
  promise()
    .then<R>((result: R) => result)
    .catch<never>(() => {
      throw error
    })
