import { useSWR } from "@compo/hooks"
import { A, flow } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMenusService } from "./service.context"

/**
 * useSWRMenus
 * This hook is used to fetch all menus
 */
export const useSWRMenus = () => {
  const { service } = useMenusService()
  const { data, isLoading, mutate } = useSWR(
    {
      fetch: service.all,
      key: `menus`,
    },
    {
      fallbackData: { menus: [] },
      keepPreviousData: false,
    }
  )

  const menus = React.useMemo(() => data.menus, [data])
  const mutateMenu = (menu: Partial<Api.Menu & Api.WithMenuItems>) =>
    mutate((data) => data && { ...data, menus: data.menus.map((m) => (m.id === menu.id ? { ...m, ...menu } : m)) })

  return {
    service,
    isLoading,
    isError: !isLoading && !data,
    menus,
    mutate,
    mutateMenu,
    rejectMenu: (menu: Api.Menu & Api.WithMenuItems) =>
      mutate((data) => data && { ...data, menus: data.menus.filter((m) => m.id !== menu.id) }),
    rejectMenuById: (id: string) => mutate((data) => data && { ...data, menus: data.menus.filter((m) => m.id !== id) }),
  }
}

/**
 * SWRMenus type
 */
export type SWRMenus = ReturnType<typeof useSWRMenus>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * useSWRMenu
 * This hook is used to fetch a menu by its id
 */
export const useSWRMenu = (menuId: string) => {
  const { service } = useMenusService()
  const { data, isLoading, mutate } = useSWR(
    {
      fetch: service.id(menuId).read,
      key: `menu-${menuId}`,
    },
    {
      keepPreviousData: false,
    }
  )
  const mutateMenu = (menu: Partial<Api.Menu & Api.WithMenuItems>) =>
    mutate((data) => data && { ...data, menu: { ...data.menu, ...menu } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.MenuItemWithRelations[]) => Api.MenuItemWithRelations[]) =>
    mutate((data) => data && { ...data, menu: { ...data.menu, items: fn(data.menu.items) } }, { revalidate: false })

  const menu = React.useMemo(() => data?.menu, [data])
  const items = React.useMemo(() => data?.menu?.items ?? [], [data])
  const itemsMutations = {
    reorderItems: (sortedIds: string[]) => mutateItems(reorder(sortedIds)),
    updateItem: (item: Api.MenuItemWithRelations) => mutateItems(A.map((f) => (f.id === item.id ? item : f))),
    appendItem: (item: Api.MenuItemWithRelations, sortedIds: string[]) =>
      mutateItems(flow(A.append(item), reorder(sortedIds))),
    rejectItem: (item: Api.MenuItemWithRelations, sortedIds: string[]) =>
      mutateItems(
        flow(
          A.filter((i) => i.id !== item.id),
          reorder(sortedIds)
        )
      ),
  }
  return {
    // swr state
    isLoading,
    isError: !isLoading && !data,
    // collections
    menu,
    items,
    // mutation helpers
    mutate,
    mutateMenu,
    ...itemsMutations,
  }
}

/**
 * SWRMenu type
 */
export type SWRMenu = ReturnType<typeof useSWRMenu>
export type SWRSafeMenu = Omit<SWRMenu, "menu" | "isLoading" | "isError"> & { menu: Api.Menu & Api.WithMenuItems }

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * reorder
 */
const reorder =
  (sortedIds: string[] | undefined) =>
  <I extends { id: string; order: number }>(items: I[]) =>
    sortedIds
      ? A.map(items, (item) => ({ ...item, order: A.getIndexBy(sortedIds, (id) => id === item.id) ?? item.order }))
      : items
