import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useProjectsService } from "../service.context"
import { useFiltersProjects } from "./use-filter-projects"

/**
 * useFilteredProjects
 */
export const useFilteredProjects = (projects: Api.ProjectWithRelations[]) => {
  const { serviceKey } = useProjectsService()
  const prefixedKey = `dashboard-projects-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.ProjectWithRelations>(`${prefixedKey}-search`, [
    ({ seo }) => translate(seo, servicePlaceholder.seo).title,
    ({ seo }) => translate(seo, servicePlaceholder.seo).description,
    ({ category }) => (category ? translate(category, servicePlaceholder.projectCategory).title : ""),
  ])
  const [sortable, sortBy] = useSortable<Api.ProjectWithRelations>(
    `${prefixedKey}-sort`,
    {
      title: [({ seo }) => translate(seo, servicePlaceholder.seo).title, "asc", "alphabet"],
      slug: [({ slug }) => slug.path, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )
  const [filterable, filterBy, activeStatus] = useFiltersProjects(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(projects, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [projects, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
