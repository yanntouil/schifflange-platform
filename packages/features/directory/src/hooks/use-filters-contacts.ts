import { useFilterable } from "@compo/hooks"
import { type Api } from "@services/dashboard"

/**
 * useFiltersContacts
 */
export const useFiltersContacts = (prefixedKey: string) => {
  const [filterable, filterBy] = useFilterable<Api.Contact>(
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
