import { useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useEventsService } from "../service.context"
import { useFiltersEvents } from "./use-filter-events"

/**
 * useFilteredEvents
 */
export const useFilteredEvents = (events: Api.EventWithRelations[]) => {
  const { serviceKey } = useEventsService()
  const prefixedKey = `dashboard-events-${serviceKey}`
  const { translate } = useLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.EventWithRelations>(`${prefixedKey}-search`, [
    ({ seo }) => translate(seo, servicePlaceholder.seo).title,
    ({ seo }) => translate(seo, servicePlaceholder.seo).description,
    ({ categories }) =>
      categories.map((category) => translate(category, servicePlaceholder.eventCategory).title).join(" "),
  ])
  const [sortable, sortBy] = useSortable<Api.EventWithRelations>(
    `${prefixedKey}-sort`,
    {
      title: [({ seo }) => translate(seo, servicePlaceholder.seo).title, "asc", "alphabet"],
      slug: [({ slug }) => slug.path, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )
  const [filterable, filterBy, activeStatus] = useFiltersEvents(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(events, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [events, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, activeStatus, reset, filtered, prefixedKey }
}
