import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { usePagesService } from "../service.context"
import { useFilters } from "./use-filter"

/**
 * useFiltered
 */
export const useFiltered = (pages: Api.PageWithRelations[]) => {
  const { serviceKey } = usePagesService()
  const prefixedKey = `dashboard-pages-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.PageWithRelations>(`${prefixedKey}-search`, [
    ({ seo }) => translate(seo, servicePlaceholder.seo).title,
    ({ seo }) => translate(seo, servicePlaceholder.seo).description,
  ])
  const [sortable, sortBy] = useSortable<Api.PageWithRelations>(
    `${prefixedKey}-sort`,
    {
      title: [({ seo }) => translate(seo, servicePlaceholder.seo).title, "asc", "alphabet"],
      slug: [({ slug }) => slug.path, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )
  const [filterable, filterBy, activeStatus] = useFilters(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(pages, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn) as Api.PageWithRelations[],
    [pages, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
