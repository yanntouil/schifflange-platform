import { useFilterable } from "@compo/hooks"
import { A, D } from "@compo/utils"
import { type Api } from "@services/dashboard"

/**
 * useFiltersEvents
 */
export const useFiltersEvents = (prefixedKey: string) => {
  const [filterable, filterBy] = useFilterable<Api.EventWithRelations>(
    `${prefixedKey}-filters`,
    {
      published: ({ state }) => state === "published",
      draft: ({ state }) => state === "draft",
    },
    {
      published: true,
    }
  )
  const activeStatus = A.find(D.toPairs(filterable.filters), ([_, value]) => value === true)?.[0]
  return [filterable, filterBy, activeStatus] as const
}
