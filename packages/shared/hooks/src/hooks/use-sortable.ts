import { A, D, G, Option, T, z, ZodSchema } from "@compo/utils"
import React from "react"
import { usePersistedState } from "./use-persisted-state"

/**
 * useSortable
 */
export const useSortable = <
  Collection extends Record<string, unknown>,
  Sorter = [(item: Collection) => unknown, SortDirection],
  SorterWithIcon = [(item: Collection) => unknown, SortDirection, SortType],
  List = Record<string, Sorter | SorterWithIcon>,
  ListKey extends keyof List = keyof List,
>(
  storageKey: string,
  fields: List,
  initial: keyof List,
  direction: SortDirection = "asc"
) => {
  // schema
  const keys = React.useMemo(() => D.keys(fields as Record<string, unknown>), [fields])
  const schema = React.useMemo(
    () =>
      z.object({
        field: z.string().refine((val) => keys.includes(val as string)),
        direction: z.enum(directions),
      }) as unknown as ZodSchema<{
        field: keyof List
        direction: SortDirection
      }>,
    [keys]
  )

  // state
  const [sort, setSort] = usePersistedState<{
    field: keyof List
    direction: SortDirection
  }>({ direction, field: initial }, storageKey, schema, localStorage)

  const nextDirection = (field: ListKey): SortDirection => {
    return isActive(field) ? (isDESC(field) ? "asc" : "desc") : (A.find(list, ([k]) => k === field)?.[1] ?? "asc")
  }

  // toggleSort
  const toggle = (field: ListKey) => setSort({ direction: nextDirection(field), field })

  const reset = () => setSort({ direction: "asc", field: initial })
  const isDESC = (field: ListKey) => sort.field === field && sort.direction === "desc"
  const isActive = (field: ListKey) => sort.field === field
  const getIcon = (field: ListKey) => {
    const sorter = D.get(fields, field) as Option<[unknown, unknown] | [unknown, unknown, SortType]>
    if (G.isNotNullable(sorter) && sorter[2]) return sorter[2]
    return "default"
  }

  const sortBy = React.useCallback(
    (items: Collection[]) => {
      const sorter = fields[sort.field] as Option<[(item: Collection) => unknown, SortDirection]>
      if (G.isNullable(sorter)) return items
      const sorterFn = sorter[0] as (item: Collection) => unknown
      if (!G.isFunction(sorterFn)) return items
      return A.sort(items, (a, b) => sorting(sorterFn(a), sorterFn(b), sort.direction))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sort]
  )

  const list = React.useMemo(
    () =>
      A.map(Object.entries(fields as Record<string, [unknown, SortDirection]>), ([k, v]) => [k, v[1]]) as [
        ListKey,
        SortDirection,
      ][],
    [fields]
  )

  // anonynimze the return type to be more flexible with all components
  return [
    {
      sort: sort as { field: string; direction: SortDirection },
      setSort: setSort as (value: { field: string; direction: SortDirection }) => void,
      nextDirection: nextDirection as (field: string) => SortDirection,
      toggle: toggle as (field: string) => void,
      reset,
      isDESC: isDESC as (field: string) => boolean,
      isActive: isActive as (field: string) => boolean,
      getIcon: getIcon as (field: string) => SortType,
      list: list as [string, SortDirection][],
    },
    sortBy,
  ] as const
}
export const sorting = (a: FieldValue, b: FieldValue, direction: SortDirection = "asc", fallbackStr = "\u{10FFFF}") => {
  const { itemA, itemB } = direction === "desc" ? { itemA: b, itemB: a } : { itemA: a, itemB: b }
  if (G.isString(itemA) && G.isString(itemB)) return (itemA || fallbackStr).localeCompare(itemB || fallbackStr)
  if (G.isDate(itemA) && G.isDate(itemB)) return T.isBefore(itemA, itemB) ? -1 : 1
  if (G.isNumber(itemA) && G.isNumber(itemB)) return itemA - itemB
  return 0
}
type FieldValue = string | Date | number | unknown
const directions = ["asc", "desc"] as const
export type SortDirection = (typeof directions)[number]
export type SortType = "alphabet" | "number" | "default"
export type UseSortableProps = ReturnType<typeof useSortable>[0]
