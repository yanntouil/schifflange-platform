import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useProjectsService } from "../service.context"
import { useFiltersCategories } from "./use-filter-categories"

/**
 * useFilteredCategories
 */
export const useFilteredCategories = (categories: Api.ProjectCategory[]) => {
  const { serviceKey } = useProjectsService()
  const prefixedKey = `dashboard-projects-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.ProjectCategory>(`${prefixedKey}-search`, [
    (category) => translate(category, servicePlaceholder.projectCategory).title,
    (category) => translate(category, servicePlaceholder.projectCategory).description,
  ])
  const [sortable, sortBy] = useSortable<Api.ProjectCategory>(
    `${prefixedKey}-sort`,
    {
      title: [(category) => translate(category, servicePlaceholder.projectCategory).title, "asc", "alphabet"],
      order: [
        (category) =>
          `${category.order}`.padStart(5, "0") + translate(category, servicePlaceholder.projectCategory).title,
        "asc",
        "number",
      ],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )
  const [filterable, filterBy, activeStatus] = useFiltersCategories(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(categories, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [categories, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
