import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useArticlesService } from "../service.context"
import { useFiltersArticles } from "./use-filter-articles"

/**
 * useFilteredArticles
 */
export const useFilteredArticles = (articles: Api.ArticleWithRelations[]) => {
  const { serviceKey } = useArticlesService()
  const prefixedKey = `dashboard-articles-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.ArticleWithRelations>(`${prefixedKey}-search`, [
    ({ seo }) => translate(seo, servicePlaceholder.seo).title,
    ({ seo }) => translate(seo, servicePlaceholder.seo).description,
    ({ category }) => (category ? translate(category, servicePlaceholder.articleCategory).title : ""),
  ])
  const [sortable, sortBy] = useSortable<Api.ArticleWithRelations>(
    `${prefixedKey}-sort`,
    {
      title: [({ seo }) => translate(seo, servicePlaceholder.seo).title, "asc", "alphabet"],
      slug: [({ slug }) => slug.path, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )
  const [filterable, filterBy, activeStatus] = useFiltersArticles(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(articles, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [articles, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
