import { useMatchable, useSortable } from "@compo/hooks"
import { useContextualLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"
import { useFiltersContacts } from "./use-filters-contacts"

/**
 * useFilteredContacts
 */
export const useFilteredContacts = (contacts: Api.Contact[]) => {
  const { serviceKey } = useDirectoryService()
  const prefixedKey = `dashboard-contacts-${serviceKey}`
  const { translate } = useContextualLanguage()
  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.Contact>(`${prefixedKey}-search`, [
    (c) => c.firstName,
    (c) => c.lastName,
    (c) => translate(c, servicePlaceholder.contact).description,
  ])
  const [sortable, sortBy] = useSortable<Api.Contact>(
    `${prefixedKey}-sort`,
    {
      firstName: [({ firstName }) => firstName, "asc", "alphabet"],
      lastName: [({ lastName }) => lastName, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "lastName"
  )
  const [filterable, filterBy] = useFiltersContacts(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(contacts, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [contacts, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, reset, filtered, prefixedKey }
}
