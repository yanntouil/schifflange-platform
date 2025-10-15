import { A } from "@mobily/ts-belt"
import React from "react"

/**
 * usePagination
 */
export const usePagination = <I extends Record<string, unknown>>(
  total: number,
  initialPage = 1,
  initialByPage = 24
) => {
  const [page, setPage] = React.useState(initialPage)
  const [byPage, setByPage] = React.useState(initialByPage)
  const pages = React.useMemo(() => Math.ceil(total / byPage), [total, byPage])
  const next = React.useCallback(() => setPage((page) => Math.min(page + 1, pages)), [pages])
  const prev = React.useCallback(() => setPage((page) => Math.max(page - 1, 1)), [])
  const paginate = A.slice<I>((page - 1) * byPage, byPage)
  const from = Math.max((page - 1) * byPage + 1, 0)
  const to = Math.min(Math.max(page * byPage, 0), total)
  return [
    {
      page,
      setPage,
      byPage,
      setByPage,
      total,
      pages,
      next,
      prev,
      from,
      to,
    },
    paginate,
  ] as const
}
export type Pagination =
  | ReturnType<typeof usePagination>[0]
  | {
      page: number
      setPage: (page: number) => void
      byPage: number
      setByPage: (byPage: number) => void
      total: number
      pages: number
      next: () => void
      prev: () => void
      from: number
      to: number
    }

/**
 * Hook générique pour paginer plusieurs collections en les combinant
 * Les collections sont prises dans l'ordre (la première en priorité)
 */
export const useMergePagination = <T extends readonly unknown[][]>(
  total: number,
  initialPage = 1,
  initialByPage = 24,
  collections: T
) => {
  const [page, setPage] = React.useState(initialPage)
  const [byPage, setByPage] = React.useState(initialByPage)
  const pages = React.useMemo(() => Math.ceil(total / byPage), [total, byPage])
  const next = React.useCallback(() => setPage((page) => Math.min(page + 1, pages)), [pages])
  const prev = React.useCallback(() => setPage((page) => Math.max(page - 1, 1)), [])
  const startIndex = Math.max((page - 1) * byPage, 0)

  const paginate = React.useMemo(() => {
    const result: unknown[][] = []
    let remainingSlots = byPage
    let globalOffset = startIndex

    for (const collection of collections) {
      if (remainingSlots <= 0) {
        result.push([])
        continue
      }

      const collectionLength = collection.length

      if (globalOffset >= collectionLength) {
        // Skip this entire collection
        globalOffset -= collectionLength
        result.push([])
      } else {
        // Take items from this collection
        const takeCount = Math.min(remainingSlots, collectionLength - globalOffset)
        const paginatedCollection = A.slice(collection, globalOffset, takeCount)
        result.push(paginatedCollection)

        remainingSlots -= takeCount
        globalOffset = 0 // Reset offset for next collections
      }
    }

    return result as unknown as T
  }, [collections, byPage, startIndex])

  // Calculate from/to based on actual paginated items
  const totalPaginatedItems = React.useMemo(() => {
    return paginate.reduce((sum, collection) => sum + collection.length, 0)
  }, [paginate])

  // Simple calculation: if we have items, show the range based on what's actually displayed
  const from = totalPaginatedItems > 0 ? Math.max(startIndex + 1, 1) : 0
  const to = totalPaginatedItems > 0 ? Math.min(startIndex + totalPaginatedItems, total) : 0

  return [
    {
      page,
      setPage,
      byPage,
      setByPage,
      total,
      pages,
      next,
      prev,
      from,
      to,
    },
    paginate,
  ] as const
}
