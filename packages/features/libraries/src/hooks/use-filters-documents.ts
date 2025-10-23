import { useFilterable } from "@compo/hooks"
import { type Api } from "@services/dashboard"

/**
 * useFiltersDocuments
 */
export const useFiltersDocuments = (prefixedKey: string) => {
  const [filterable, filterBy] = useFilterable<Api.LibraryDocument>(
    `${prefixedKey}-filters`,
    {
      // Add filter definitions here if needed
      // Example:
      // hasDocuments: (library) => library.documents && library.documents.length > 0,
    },
    {
      // Add default filter values here if needed
      // Example:
      // hasDocuments: false,
    }
  )
  return [filterable, filterBy] as const
}
