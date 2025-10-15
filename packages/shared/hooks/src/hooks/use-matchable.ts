import { matchSorter } from "match-sorter"
import { z } from "zod"
import { usePersistedState } from "./use-persisted-state"

/**
 * useMatchable
 */
export const useMatchable = <T extends Record<string, unknown>>(
  storageKey: string,
  keys: (string | ((item: T) => string))[]
) => {
  const [search, setSearch] = usePersistedState("", storageKey, z.string(), sessionStorage)

  const searchIn = (items: T[]) => matchSorter(items, normString(search), { keys })

  return [{ search, setSearch }, searchIn] as const
}
export const normString = (term: string) =>
  term
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,/"#!$%^&*;:{}=\-_`~()]/g, "")
