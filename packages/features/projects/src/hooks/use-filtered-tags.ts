import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useProjectsService } from "../service.context"
import { useFiltersTags } from "./use-filter-tags"

/**
 * useFilteredTags
 */
export const useFilteredTags = (tags: Api.ProjectTag[]) => {
  const { serviceKey } = useProjectsService()
  const prefixedKey = `dashboard-projects-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.ProjectTag>(`${prefixedKey}-search`, [
    (tag) => translate(tag, servicePlaceholder.projectTag).name,
  ])
  const [sortable, sortBy] = useSortable<Api.ProjectTag>(
    `${prefixedKey}-sort`,
    {
      name: [(tag) => translate(tag, servicePlaceholder.projectTag).name, "asc", "alphabet"],
      order: [
        (tag) => `${tag.order}`.padStart(5, "0") + translate(tag, servicePlaceholder.projectTag).name,
        "asc",
        "number",
      ],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "name"
  )
  const [filterable, filterBy, activeStatus] = useFiltersTags(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(tags, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [tags, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
