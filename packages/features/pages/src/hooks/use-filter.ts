import { useFilterable } from "@compo/hooks"
import { A, D } from "@compo/utils"
import { type Api } from "@services/dashboard"

/**
 * useFilters
 */
export const useFilters = (prefixedKey: string) => {
  const [filterable, filterBy] = useFilterable<Api.PageWithRelations>(
    `${prefixedKey}-filters`,
    {
      published: ({ state }) => state === "published",
      draft: ({ state }) => state === "draft",
    },
    {}
  )
  const activeStatus = A.find(D.toPairs(filterable.filters), ([_, value]) => value === true)?.[0]
  return [filterable, filterBy, activeStatus] as const
}
