import { useMatchable, useSortable } from "@compo/hooks"
import { useContextualLanguage } from "@compo/translations"
import { pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useLibrariesService } from "../service.context"
import { useFiltersDocuments } from "./use-filters-documents"

/**
 * useFilteredDocuments
 */
export const useFilteredDocuments = (documents: Api.LibraryDocument[]) => {
  const { serviceKey, libraryId } = useLibrariesService()
  const prefixedKey = `dashboard-documents-${serviceKey}`
  const { translate } = useContextualLanguage()

  // Simple search state
  const [matchable, matchIn] = useMatchable<Api.LibraryDocument>(`${prefixedKey}-search`, [
    (l) => translate(l, servicePlaceholder.library).title,
    (l) => translate(l, servicePlaceholder.library).description,
  ])

  const [sortable, sortBy] = useSortable<Api.LibraryDocument>(
    `${prefixedKey}-sort`,
    {
      title: [(d) => translate(d, servicePlaceholder.libraryDocument).title, "asc", "alphabet"],
      createdAt: [({ createdAt }) => createdAt, "desc", "number"],
      updatedAt: [({ updatedAt }) => updatedAt, "desc", "number"],
    },
    "title"
  )

  const [filterable, filterBy] = useFiltersDocuments(prefixedKey)

  const reset = () => {
    matchable.setSearch("")
    filterable.reset()
  }

  // apply filters
  const filtered = React.useMemo(
    () => pipe(documents, filterBy, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [documents, matchable.search, matchIn, sortBy, filterBy]
  )

  return { matchable, sortable, filterable, reset, filtered, prefixedKey }
}
