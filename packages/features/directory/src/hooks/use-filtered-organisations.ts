import { useMatchable, useSortable } from "@compo/hooks"
import { useContextualLanguage } from "@compo/translations"
import { F, G, isNotEmptyString, pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"
import { useFiltersOrganisations } from "./use-filters-organisations"

/**
 * useFilteredOrganisations
 */
export const useFilteredOrganisations = (organisations: Api.Organisation[]) => {
  const { serviceKey, organisationType } = useDirectoryService()
  const disableFilters = G.isNotNullable(organisationType) && isNotEmptyString(organisationType)
  const prefixedKey = `dashboard-organisations-${serviceKey}`
  const { translate } = useContextualLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.Organisation>(`${prefixedKey}-search`, [
    (o) => translate(o, servicePlaceholder.organisation).name,
  ])
  const [sortable, sortBy] = useSortable<Api.Organisation>(
    `${prefixedKey}-sort`,
    {
      name: [(o) => translate(o, servicePlaceholder.organisation).name, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "name"
  )
  const [filterable, filterBy] = useFiltersOrganisations(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () =>
      pipe(
        organisations,
        disableFilters ? F.identity : filterBy,
        S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn
      ),
    [organisations, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, filterable, reset, filtered, prefixedKey, disableFilters }
}
