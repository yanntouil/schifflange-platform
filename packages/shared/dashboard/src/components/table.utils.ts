import type { ColumnDef, ColumnSizingState, OnChangeFn } from "@tanstack/react-table"
import { type Column } from "@tanstack/react-table"
import React from "react"
/**
 * get pinning styles
 * @param column
 * @returns object of React.CSSProperties
 */
export const getPinningStyles = <T extends { id: string }>(column: Column<T>): React.CSSProperties => {
  const isPinned = column.getIsPinned()
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

/**
 * use table column sizing
 * @param storeState
 * @param setStoreState
 * @returns
 */
export const useTableColumnSizing = (storeState: ColumnSizingState, setStoreState: (state: ColumnSizingState) => void) => {
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(() => storeState)
  const onColumnSizingChange: OnChangeFn<ColumnSizingState> = (updater) => {
    const next = typeof updater === "function" ? updater(columnSizing) : updater
    setColumnSizing(next)
    setStoreState(next)
  }
  return {
    state: columnSizing,
    onChange: onColumnSizingChange,
    initial: storeState,
  }
}

export const makeColumnSize = ({
  size,
  minSize,
  maxSize,
}: {
  size?: number
  minSize?: number
  maxSize?: number
} = {}): Partial<ColumnDef<any>> => ({
  size: size ?? 200,
  minSize: minSize ?? 50,
  maxSize: maxSize ?? 500,
})
