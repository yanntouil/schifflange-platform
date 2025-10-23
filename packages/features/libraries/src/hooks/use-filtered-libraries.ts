import { useMatchable, useSortable } from "@compo/hooks"
import { useContextualLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useLibrariesService } from "../service.context"
import { useFiltersLibraries } from "./use-filters-libraries"

/**
 * useFilteredLibraries
 */
export const useFilteredLibraries = (libraries: Api.Library[]) => {
  const { serviceKey, libraryId } = useLibrariesService()
  const prefixedKey = `dashboard-libraries-${serviceKey}`
  const { translate } = useContextualLanguage()

  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.Library>(`${prefixedKey}-search`, [
    (l) => translate(l, servicePlaceholder.library).title,
    (l) => translate(l, servicePlaceholder.library).description,
  ])

  const [sortable, sortBy] = useSortable<Api.Library>(
    `${prefixedKey}-sort`,
    {
      title: [(l) => translate(l, servicePlaceholder.library).title, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )

  const [filterable, filterBy] = useFiltersLibraries(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(libraries, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [libraries, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, reset, filtered, prefixedKey }
}
