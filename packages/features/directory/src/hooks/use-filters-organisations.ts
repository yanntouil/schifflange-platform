import { useFilterable } from "@compo/hooks"
import { type Api } from "@services/dashboard"

/**
 * useFiltersOrganisations
 */
export const useFiltersOrganisations = (prefixedKey: string) => {
  const [filterable, filterBy] = useFilterable<Api.Organisation>(
    `${prefixedKey}-filters`,
    {
      //
    },
    {
      //
    }
  )
  return [filterable, filterBy] as const
}
