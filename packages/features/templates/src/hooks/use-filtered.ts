import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useTemplatesService } from "../service.context"
import { useFilters } from "./use-filter"

/**
 * useFiltered
 */
export const useFiltered = (templates: Api.TemplateWithRelations[]) => {
  const { serviceKey } = useTemplatesService()
  const prefixedKey = `dashboard-templates-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.TemplateWithRelations>(`${prefixedKey}-search`, [
    (item) => translate(item, servicePlaceholder.template).title,
    (item) => translate(item, servicePlaceholder.template).description,
  ])
  const [sortable, sortBy] = useSortable<Api.TemplateWithRelations>(
    `${prefixedKey}-sort`,
    {
      title: [(item) => translate(item, servicePlaceholder.template).title, "asc", "alphabet"],
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
    () =>
      pipe(templates, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn) as Api.TemplateWithRelations[],
    [templates, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
