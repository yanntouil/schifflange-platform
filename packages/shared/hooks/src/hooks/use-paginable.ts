import { A } from "@compo/utils"
import React from "react"
/**
 * usePaginable
 */
export const usePaginable = <I>(items: I[], initialPage = 1, initialByPage = 24) => {
  const [page, setPage] = React.useState(initialPage)
  const [byPage, setByPage] = React.useState(initialByPage)
  const total = React.useMemo(() => items.length, [items])
  const pages = React.useMemo(() => Math.ceil(total / byPage), [total, byPage])
  const next = React.useCallback(() => setPage((page) => Math.min(page + 1, pages)), [pages])
  const prev = React.useCallback(() => setPage((page) => Math.max(page - 1, 1)), [])
  // const paginated = React.useMemo(() => A.slice(items, (page - 1) * byPage, byPage), [items, page, byPage])
  const paginate = A.slice<I>((page - 1) * byPage, byPage)
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
    },
    paginate,
  ] as const
}
