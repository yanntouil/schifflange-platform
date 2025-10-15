import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as placeholderService } from "@services/dashboard"
import React from "react"
import { useForwardsService } from "../service.context"
import { getSlugSeo } from "../utils"

/**
 * useFilteredForwards
 */
export const useFilteredForwards = (forwards: Api.Forward[]) => {
  const { serviceKey } = useForwardsService()
  const prefixedKey = `dashboard-forwards-${serviceKey}`
  const { translate } = useLanguage()
  // Matchable - Search functionality
  const [matchable, matchIn] = useMatchable<Api.Forward>(`${prefixedKey}-search`, [
    (item) => translate(getSlugSeo(item.slug), placeholderService.seo).title,
    (item) => item.path,
    (item) => item.slug.path,
  ])

  // Sortable - Sort functionality
  const [sortable, sortBy] = useSortable<Api.Forward>(
    `${prefixedKey}-sort`,
    {
      title: [(forward) => translate(getSlugSeo(forward.slug), placeholderService.seo).title, "asc", "alphabet"],
      path: [(forward) => forward.path, "asc", "alphabet"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "path"
  )

  const reset = () => {
    matchable.setSearch("")
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(forwards, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn) as Api.Forward[],
    [forwards, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, reset, filtered, prefixedKey }
}
