import { useMatchable, useSortable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { A, pipe, S, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useCouncilsService } from "../service.context"

/**
 * useFilteredCouncils
 */
const formats = ["P", "PP", "PPP", "PPPP", "p"]
export const useFilteredCouncils = (councils: Api.Council[]) => {
  const { serviceKey } = useCouncilsService()
  const prefixedKey = `dashboard-councils-${serviceKey}`
  const { format } = useTranslation()
  const { translate } = useLanguage()

  // Search
  const [matchable, matchIn] = useMatchable<Api.Council>(`${prefixedKey}-search`, [
    (council) => translate(council, servicePlaceholder.council).agenda,
    ...A.map(
      formats,
      (f) =>
        ({ date }: Api.Council) =>
          T.isValid(date) ? format(date, f) : ""
    ),
  ])

  // Sort
  const [sortable, sortBy] = useSortable<Api.Council>(
    `${prefixedKey}-sort`,
    {
      date: [({ date }) => date, "desc", "number"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "date"
  )

  const reset = () => {
    matchable.setSearch("")
  }

  // Apply filters
  const filtered = React.useMemo(
    () => pipe(councils, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [councils, matchable.search, matchIn, sortBy]
  )

  // Note: filterable removed for now, add back when filters are implemented
  const filterable = { filters: {}, updateFilter: () => {}, reset: () => {} }

  return { matchable, sortable, filterable, reset, filtered, prefixedKey }
}
