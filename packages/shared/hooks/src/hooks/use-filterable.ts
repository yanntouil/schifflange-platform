import { A, D, G, Option, z, ZodSchema } from "@compo/utils"
import React from "react"
import { usePersistedState } from "./use-persisted-state"

/**
 * useFilterable
 */
export const useFilterable = <T extends Record<string, unknown>, F = Record<string, (item: T) => boolean>>(
  storageKey: string,
  fields: F,
  initial: Partial<Record<keyof F, boolean>>
) => {
  const keys = React.useMemo(() => D.keys(fields as Record<string, unknown>), [fields])
  const schema = React.useMemo(
    () =>
      z.record(
        z.string().refine((val) => keys.includes(val as string)),
        z.boolean()
      ) as unknown as ZodSchema<Partial<Record<keyof F, boolean>>>,
    [keys]
  )
  const [filters, setFilters] = usePersistedState(initial, storageKey, schema, localStorage)

  const isActive = React.useCallback((field: keyof F) => D.get(filters, field) === true, [filters])
  const isInactive = React.useCallback((field: keyof F) => D.get(filters, field) === false, [filters])

  const toggle = (field: keyof F) => {
    const current = D.get(filters, field)
    const key = field as string
    if (G.isNullable(current) || current === false) setFilters(D.set(key, true))
    else setFilters(D.set(filters, key, false))
  }
  const toggleList = (field: keyof F, list: (keyof F)[]) => {
    A.forEach(list, (c) => (c === field ? setTrue(c) : unset(c)))
  }
  const unsetList = (list: (keyof F)[]) => {
    A.forEach(list, (c) => unset(c))
  }

  const setFalse = (field: keyof F) => {
    const current = D.get(filters, field)
    const key = field as string
    if (G.isNullable(current) || current === true) setFilters(D.set(key, false))
  }
  const setTrue = (field: keyof F) => {
    const current = D.get(filters, field)
    const key = field as string
    if (G.isNullable(current) || current === false) setFilters(D.set(key, true))
  }
  const unset = (field: keyof F) => {
    if (field in filters) {
      setFilters((filters) => D.rejectWithKey(filters, (current) => current === field))
    }
  }
  const reset = () => setFilters(initial)
  const toggleActive = (field: keyof F) => (isActive(field) ? unset(field) : setTrue(field))
  const toggleInactive = (field: keyof F) => (isInactive(field) ? unset(field) : setFalse(field))

  const list = React.useMemo(() => D.keys(fields as Record<string, unknown>), [fields])
  const filterBy = React.useCallback(
    (items: T[]) =>
      A.filter(items, (item) =>
        A.every(D.keys(filters), (key) => {
          const fn = D.get(fields, key as keyof F) as Option<(item: T) => boolean>
          const compare = D.get(filters, key as keyof F)
          return G.isNotNullable(fn) ? fn(item) === compare : true
        })
      ),
    [filters, fields]
  )

  return [
    {
      filters,
      setFilters,
      list,
      toggle,
      toggleList,
      unsetList,
      setFalse,
      setTrue,
      unset,
      reset,
      isActive,
      isInactive,
      toggleActive,
      toggleInactive,
    },
    filterBy,
  ] as const
}
