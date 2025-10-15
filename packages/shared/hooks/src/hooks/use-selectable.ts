import { A, D, F } from "@compo/utils"
import React from "react"

/**
 * useSelectable is a hook that allows you to select items from a list
 * with better performance using a record-based approach
 */
export const useSelectable = <T extends { id: string }>(
  params: {
    multiple?: boolean
    onSelect?: (selected: T[]) => void
  } = {}
) => {
  const { multiple = true, onSelect = F.ignore } = params

  const [selected, setSelected] = React.useReducer(
    (prev: Record<string, T>, fn: (s: Record<string, T>) => Record<string, T>) => {
      const next = fn(prev)
      onSelect(Object.values(next))
      return next
    },
    {}
  )

  const selectedIds = React.useMemo(() => Object.keys(selected), [selected])

  const select = React.useCallback(
    (item: T, unselectOthers?: boolean) => {
      setSelected((prev) => {
        if (unselectOthers || !multiple) return { [item.id]: item }
        if (prev[item.id]) return prev
        return { ...prev, [item.id]: item }
      })
    },
    [multiple]
  )

  const unselect = React.useCallback((item: T) => {
    setSelected((prev) => {
      const { [item.id]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clear = React.useCallback(() => {
    setSelected((prev) => (Object.keys(prev).length === 0 ? prev : {}))
  }, [])

  const isSelected = React.useCallback((item: T) => !!selected[item.id], [selected])
  const selectedArray = React.useMemo(() => Object.values(selected), [selected])
  const hasSelection = React.useMemo(() => selectedArray.length > 0, [selectedArray])

  const keepOnly = React.useCallback((items: T[]) => {
    setSelected(D.selectKeys(A.map(items, D.prop("id"))))
  }, [])

  const selectable = {
    selected: selectedArray,
    select,
    unselect,
    clear,
    isSelected,
    hasSelection,
    multiple,
  }

  return {
    selected: selectedArray,
    selectedIds,
    select,
    unselect,
    clear,
    isSelected,
    keepOnly,
    hasSelection,
    multiple,
    selectable,
  }
}
export type Selectable<T extends { id: string }> = ReturnType<typeof useSelectable<T>>

/**
 * initialSelectable is a default value for the useSelectable hook
 */
export const initialSelectable = {
  selected: [],
  select: F.ignore,
  isSelected: F.falsy,
  unselect: F.ignore,
  clear: F.ignore,
  hasSelection: false,
}

/**
 * smartSelect is a function that allows you to select items from a list
 * using the ctrl key
 */

export const smartClick = <T extends { id: string }>(
  item: T,
  selectable: Selectable<T>["selectable"],
  onclick?: (() => void) | true
) => {
  const { select, unselect, selected } = selectable
  const isSelected = selected.some((current) => current.id === item.id)
  const somethingIsSelected = selected.length > 0
  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.shiftKey) isSelected ? unselect(item) : select(item)
    else if (somethingIsSelected) isSelected ? unselect(item) : select(item)
    // select(item, true)? unselect(item) : select(item)
    else if (onclick === true) isSelected ? unselect(item) : select(item)
    else onclick?.()
  }
  return {
    onClick,
    selected: isSelected,
  }
}

/**
 * useKeepOnly is a hook that allows you to keep only the selected items from a list
 * @param items - the list of items
 * @param keepOnly - the function to keep only the selected items
 */
export const useKeepOnly = <T extends { id: string }>(items: T[], keepOnly: (items: T[]) => void) => {
  React.useEffect(() => {
    keepOnly(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])
}
