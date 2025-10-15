import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import React from "react"
import { useCollection } from "./collection.context"
import { collectionFullSpanVariants } from "./collection.variants"

/**
 * Pagination for collections
 */
type PaginationProps = React.ComponentProps<"div"> & {
  total: number
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
  before?: number
  after?: number
}
export const Pagination: React.FC<PaginationProps> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { view } = useCollection()
  const { total, setPage, limit, setLimit, before = 1, after = 1, className, ...rest } = props

  // pagination
  const page = Math.max(props.page, 1)
  const pages = Math.ceil(total / limit)
  const next = () => setPage(Math.min(page + 1, pages))
  const prev = () => setPage(Math.max(page - 1, 1))

  // results
  const from = Math.max((page - 1) * limit + 1, 0)
  const to = Math.min(page * limit, total)
  const paginationProps = React.useMemo(
    () => ({
      page,
      setPage,
      byPage: limit,
      setByPage: setLimit,
      total,
      pages,
      next,
      prev,
      from,
      to,
    }),
    [page, limit, total, setPage, setLimit, next, prev, from, to]
  )

  if (pages <= 1) return null

  return (
    <div
      {...rest}
      className={cxm(
        "mt-4 flex flex-col items-center justify-between gap-x-6 @2xl/collection:flex-row",
        collectionFullSpanVariants({ view })
      )}
    >
      <p className='text-muted-foreground inline-flex h-9 shrink-0 items-center text-xs/relaxed'>
        {_("total", { from, to, total })}
      </p>
      <Ui.Pagination.Quick {...paginationProps} size='sm' className={cxm("@2xl/collection:justify-end", className)} />
    </div>
  )
}

const dictionary = {
  fr: {
    total: "Résultats {{from}} à {{to}} sur {{total}}",
  },
  en: {
    total: "Results {{from}} to {{to}} of {{total}}",
  },
  de: {
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
  },
}
