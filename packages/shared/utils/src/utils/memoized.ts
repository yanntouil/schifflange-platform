/**
 * memoize
 * @param fn - The function to memoize
 * @returns The memoized function with the same signature as the input function
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>()

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  } as T
}
