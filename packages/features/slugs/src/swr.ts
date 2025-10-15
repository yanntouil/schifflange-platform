import { useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useSlugsService } from "./service.context"

/**
 * useSWRSlugs
 */
export const useSWRSlugs = () => {
  const { service, serviceKey } = useSlugsService()
  const { data, isLoading, mutate } = useSWR(
    {
      fetch: service.all,
      key: `${serviceKey}-slugs`,
    },
    {
      fallbackData: { slugs: [] },
      keepPreviousData: false,
    }
  )

  const slugs = React.useMemo(() => data.slugs, [data])

  const mutateSlug = (slug: Partial<Api.Slug & Api.WithModel>) =>
    mutate(
      (data) =>
        data && {
          ...data,
          slugs: A.map(data.slugs, (s) =>
            s.id === slug.id ? { ...(s as Api.Slug & Api.WithModel), ...(slug as Api.Slug & Api.WithModel) } : s
          ),
        }
    )

  return {
    service,
    // swr state
    isLoading,
    isError: !isLoading && !data,
    // collections
    slugs,
    // mutation helpers
    mutate,
    mutateSlug,
  }
}

export type SWRSlug = ReturnType<typeof useSWRSlugs>
