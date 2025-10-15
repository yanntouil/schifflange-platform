import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useArticlesService } from "../service.context"
import { useFiltersCategories } from "./use-filter-categories"

/**
 * useFilteredCategories
 */
export const useFilteredCategories = (categories: Api.ArticleCategory[]) => {
  const { serviceKey } = useArticlesService()
  const prefixedKey = `dashboard-articles-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.ArticleCategory>(`${prefixedKey}-search`, [
    (category) => translate(category, servicePlaceholder.articleCategory).title,
    (category) => translate(category, servicePlaceholder.articleCategory).description,
  ])
  const [sortable, sortBy] = useSortable<Api.ArticleCategory>(
    `${prefixedKey}-sort`,
    {
      title: [(category) => translate(category, servicePlaceholder.articleCategory).title, "asc", "alphabet"],
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
