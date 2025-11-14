"use client"

import { cxm, match } from "@compo/utils"
import { A } from "@mobily/ts-belt"
import * as Primitive from "@radix-ui/react-navigation-menu"
import React from "react"
import { Api } from "../../service"
import { Ui } from "../ui"
import { ItemLink } from "./header.menu.item-link"
import { LevelThirdList } from "./header.menu.level-third"

/**
 * render a second level
 */
type SecondLevelProps = {
  items: Api.MenuItemWithRelations[]
}
export const SecondLevelList: React.FC<SecondLevelProps> = ({ items }) => {
  const numColumns = 5
  const contentRef = React.useRef<HTMLDivElement>(null)

  const navigationContext = useFocusableItems(items, contentRef)
  const columns = useLevelFirstColumns(items, numColumns)
  // remove empty columns
  const nonEmptyColumns = columns.filter((col: Api.MenuItemWithRelations[]) => col.length > 0)
  return (
    <div
      ref={contentRef}
      className='grid gap-4'
      style={{ gridTemplateColumns: `repeat(${nonEmptyColumns.length}, minmax(max-content, 250px))` }}
    >
      {nonEmptyColumns.map((columnItems, colIndex) => (
        <ul className='flex flex-col gap-6 w-max' key={colIndex}>
          {A.map(columnItems, (item) =>
            match(item)
              .with({ type: "group" }, (item) => (
                <SecondLevelGroup key={item.id} item={item} navigation={navigationContext} />
              ))
              .otherwise((item) => <SecondLevelItem key={item.id} item={item} navigation={navigationContext} />)
          )}
        </ul>
      ))}
    </div>
  )
}

/**
 * render a second level as a group
 */
type SecondLevelGroupProps = {
  item: Api.MenuItemGroup
  navigation: NavigationContext
}
const SecondLevelGroup: React.FC<SecondLevelGroupProps> = (props) => {
  const { item, navigation } = props
  const { translations, items } = item
  return (
    <Primitive.Item className='flex flex-col gap-2 w-max'>
      <p className='text-sm pl-5 font-medium leading-none text-muted-foreground uppercase w-max max-w-72'>
        {translations?.name || ""}
      </p>
      <LevelThirdList items={items} navigation={navigation} />
    </Primitive.Item>
  )
}

/**
 * render a second level as a item
 */
type SecondLevelItemProps = {
  item: Api.MenuItemLink | Api.MenuItemResource | Api.MenuItemUrl
  navigation: NavigationContext
}
const SecondLevelItem: React.FC<SecondLevelItemProps> = (props) => {
  const { item, navigation } = props
  const linkRef = React.useRef<HTMLAnchorElement>(null)

  // Focus si cet item a le focusId
  React.useEffect(() => {
    if (navigation.focusId === item.id) {
      linkRef.current?.focus()
    }
  }, [navigation.focusId, item.id])

  return (
    <Primitive.Item
      data-state={navigation.focusId === item.id ? "active" : "inactive"}
      className='group/item'
      onMouseEnter={() => navigation.setFocusId(item.id)}
    >
      <Primitive.Link asChild className={navigationItemCx}>
        <ItemLink item={item} ref={linkRef} />
      </Primitive.Link>
    </Primitive.Item>
  )
}

/**
 * navigationItemCx
 */
export const navigationItemCx = cxm(
  "navigation-menu-link",
  "block text-xs font-semibold outline-none rounded-xs",
  "group-data-[state=active]/item:ring-2 group-data-[state=active]/item:ring-ring group-data-[state=active]/item:ring-offset-2 group-data-[state=active]/item:ring-offset-white",
  Ui.variants.disabled()
)

/**
 * flattenItems
 * flatten items to make them focusable
 */
const flattenItems = (items: Api.MenuItemWithRelations[]): FocusableItem[] => {
  const result: FocusableItem[] = []

  const flatten = (items: Api.MenuItemWithRelations[]) => {
    items.forEach((item) => {
      if (item.type === "group") {
        flatten(item.items)
      } else {
        result.push({ id: item.id, item })
      }
    })
  }

  flatten(items)
  return result
}

/**
 * useFirstLevelColumns
 * distribute items into columns, each column has at most 4 items
 */
const useLevelFirstColumns = (items: Api.MenuItemWithRelations[], numColumns: number) => {
  return React.useMemo(() => {
    const getChildCount = (item: Api.MenuItemWithRelations) => (item.type === "group" ? item.items.length : 1)

    const getColumnSize = (column: Api.MenuItemWithRelations[]) =>
      column.reduce((acc, item) => acc + getChildCount(item), 0)

    const distributeItems = (
      remainingItems: Api.MenuItemWithRelations[],
      cols: Api.MenuItemWithRelations[][],
      colIndex: number
    ): Api.MenuItemWithRelations[][] => {
      if (remainingItems.length === 0 || colIndex >= numColumns) {
        return cols
      }

      const [currentItem, ...rest] = remainingItems
      const childCount = getChildCount(currentItem)
      const currentColumn = cols[colIndex]

      // if the item has more than 4 children, it takes an entire column
      if (childCount > 3) {
        // if the current column is not empty, go to the next column
        if (currentColumn.length > 0) {
          return distributeItems(remainingItems, cols, colIndex + 1)
        }
        const newCols = cols.map((col, idx) => (idx === colIndex ? [...col, currentItem] : col))
        return distributeItems(rest, newCols, colIndex + 1)
      }

      // otherwise, we can share the column
      const newColumn = [...currentColumn, currentItem]
      const newCols = cols.map((col, idx) => (idx === colIndex ? newColumn : col))
      const columnSize = getColumnSize(newColumn)

      // if the column is well filled (>3 items), go to the next column
      const nextColIndex = columnSize > 3 ? colIndex + 1 : colIndex
      return distributeItems(rest, newCols, nextColIndex)
    }

    const initialColumns: Api.MenuItemWithRelations[][] = Array.from({ length: numColumns }, () => [])
    return distributeItems(items, initialColumns, 0)
  }, [items, numColumns])
}

/**
 * useFocusableItems
 */
const useFocusableItems = (items: Api.MenuItemWithRelations[], contentRef: React.RefObject<HTMLDivElement>) => {
  // flatten items to make them focusable
  const focusableItems = React.useMemo(() => flattenItems(items), [items])

  // state for navigation
  const [focusId, setFocusId] = React.useState<string | null>(null)

  // Navigation handlers
  const onNext = React.useCallback(() => {
    if (focusableItems.length === 0) return
    const currentIndex = focusableItems.findIndex((i) => i.id === focusId)
    const nextIndex = currentIndex < focusableItems.length - 1 ? currentIndex + 1 : 0
    setFocusId(focusableItems[nextIndex].id)
  }, [focusId, focusableItems])

  const onPrev = React.useCallback(() => {
    if (focusableItems.length === 0) return
    const currentIndex = focusableItems.findIndex((i) => i.id === focusId)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1
    setFocusId(focusableItems[prevIndex].id)
  }, [focusId, focusableItems])

  // handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contentRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          onNext()
          break
        case "ArrowUp":
          e.preventDefault()
          onPrev()
          break
        case "Home":
          e.preventDefault()
          if (focusableItems.length > 0) setFocusId(focusableItems[0].id)
          break
        case "End":
          e.preventDefault()
          if (focusableItems.length > 0) setFocusId(focusableItems[focusableItems.length - 1].id)
          break
      }
    }

    const content = contentRef.current
    content?.addEventListener("keydown", handleKeyDown)
    return () => content?.removeEventListener("keydown", handleKeyDown)
  }, [onNext, onPrev, focusableItems])

  // focus on the first item when the menu opens
  React.useEffect(() => {
    if (focusableItems.length > 0 && focusId === null) {
      setFocusId(focusableItems[0].id)
    }
  }, [focusableItems, focusId])

  return { focusId, onNext, onPrev, setFocusId }
}

/**
 * types
 */
export type FocusableItem = {
  id: string
  item: Api.MenuItemLink | Api.MenuItemResource | Api.MenuItemUrl
}
export type NavigationContext = ReturnType<typeof useFocusableItems>
