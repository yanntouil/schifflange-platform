import { A, D } from "@mobily/ts-belt"

/**
 * byId
 * transform an array of items into an object by their id
 */
export const byId = <L extends { id: string }, R = void>(
  items: L[],
  localize?: (item: L) => R
): { [key: string]: R extends void ? L : R } =>
  A.reduce(items, {} as Record<string, R extends void ? L : R>, (items, item) =>
    D.set(items, item.id, localize ? localize(item) : item)
  )
