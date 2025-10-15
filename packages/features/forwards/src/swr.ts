import { useSWR } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { useForwardsService } from "./service.context"

/**
 * useSWRForwards
 */
export const useSWRForwards = () => {
  const { service, serviceKey } = useForwardsService()
  const { data, isLoading, mutate } = useSWR(
    {
      fetch: service.all,
      key: `${serviceKey}-forwards`,
    },
    {
      fallbackData: { forwards: [] },
      keepPreviousData: false,
    }
  )

  const forwards = React.useMemo(() => data.forwards, [data])
  const mutateForward = (forward: Partial<Api.Forward>) =>
    mutate(
      (data) =>
        data && { ...data, forwards: data.forwards.map((f) => (f.id === forward.id ? { ...f, ...forward } : f)) }
    )

  return {
    service,
    // swr state
    isLoading,
    isError: !isLoading && !data,
    // collections
    forwards,
    // mutation helpers
    mutate,
    mutateForward,
    rejectForward: (forward: Api.Forward) =>
      mutate((data) => data && { ...data, forwards: data.forwards.filter((f) => f.id !== forward.id) }),
    rejectForwardById: (id: string) =>
      mutate((data) => data && { ...data, forwards: data.forwards.filter((f) => f.id !== id) }),
  }
}

/**
 * types
 */
export type SWRForwards = ReturnType<typeof useSWRForwards>
