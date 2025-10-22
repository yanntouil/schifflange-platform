import { useMatchable, useSortable } from "@compo/hooks"
import { useContextualLanguage } from "@compo/translations"
import { pipe, S, zeroPad } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"
import { useFiltersCategories } from "./use-filters-categories"

/**
 * useFilteredCategories
 */
export const useFilteredCategories = (categories: Api.OrganisationCategory[]) => {
  const { serviceKey } = useDirectoryService()
  const prefixedKey = `dashboard-organisation-categories-${serviceKey}`
  const { translate } = useContextualLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.OrganisationCategory>(`${prefixedKey}-search`, [
    (c) => translate(c, servicePlaceholder.organisationCategory).title,
    (c) => translate(c, servicePlaceholder.organisationCategory).description,
  ])
  const [sortable, sortBy] = useSortable<Api.OrganisationCategory>(
    `${prefixedKey}-sort`,
    {
      title: [(c) => translate(c, servicePlaceholder.organisationCategory).title, "asc", "alphabet"],
      order: [({ order, type }) => `${type}-${zeroPad(order, 6)}`, "asc", "number"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "order"
  )
  const [filterable, filterBy] = useFiltersCategories(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(categories, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [categories, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, reset, filtered, prefixedKey }
}
