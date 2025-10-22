import { useMatchable, useSortable } from "@compo/hooks"
import { useContextualLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"

/**
 * useFilteredContactOrganisations
 */
export const useFilteredContactOrganisations = (contactOrganisations: Api.ContactOrganisation[]) => {
  const { serviceKey } = useDirectoryService()
  const prefixedKey = `dashboard-contact-organisations-${serviceKey}`
  const { translate } = useContextualLanguage()

  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.ContactOrganisation>(`${prefixedKey}-search`, [
    (co) => co.contact?.firstName ?? "",
    (co) => co.contact?.lastName ?? "",
    (co) => translate(co, servicePlaceholder.contactOrganisation).role,
  ])

  const [sortable, sortBy] = useSortable<Api.ContactOrganisation>(
    `${prefixedKey}-sort`,
    {
      role: [(co) => translate(co, servicePlaceholder.contactOrganisation).role, "asc", "alphabet"],
      firstName: [(co) => co.contact?.firstName ?? "", "asc", "alphabet"],
      lastName: [(co) => co.contact?.lastName ?? "", "asc", "alphabet"],
      order: [(co) => co.order, "asc", "number"],
    },
    "order"
  )

  const reset = () => {
    matchable.setSearch("")
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(contactOrganisations, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [contactOrganisations, matchable.search, matchIn, sortBy]
  )

  return { matchable, sortable, reset, filtered, prefixedKey }
}
