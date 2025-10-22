import { useFilterable } from "@compo/hooks"
import { type Api } from "@services/dashboard"

/**
 * useFiltersCategories
 */
export const useFiltersCategories = (prefixedKey: string) => {
  const [filterable, filterBy] = useFilterable<Api.OrganisationCategory>(
    `${prefixedKey}-filters`,
    {
      municipality: ({ type }) => type === "municipality",
      service: ({ type }) => type === "service",
      association: ({ type }) => type === "association",
      commission: ({ type }) => type === "commission",
      company: ({ type }) => type === "company",
      other: ({ type }) => type === "other",
    },
    {
      //
    }
  )
  return [filterable, filterBy] as const
}
