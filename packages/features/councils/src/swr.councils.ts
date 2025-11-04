import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useSWRConfig } from "swr"
import { useCouncilsService } from "./service.context"

/**
 * useSwrCouncils
 */
export const useSwrCouncils = (query?: Api.Payload.Workspaces.Councils.All) => {
  const { service, serviceKey } = useCouncilsService()
  const key = useMemoKey(baseKey, { serviceKey, query })
  const { data, mutate, ...props } = useSWR(
    { fetch: () => service.all(query), key },
    { fallbackData: { councils: [] }, keepPreviousData: true }
  )
  const { councils } = data
  return {
    ...props,
    ...createCouncilMutations((fn: (items: Api.Council[]) => Api.Council[]) =>
      mutate((data) => data && { ...data, councils: fn(data.councils) }, { revalidate: true })
    ),
    mutate,
    councils,
  }
}

/**
 * useMutateCouncils
 */
export const useMutateCouncils = () => {
  const { serviceKey } = useCouncilsService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createCouncilMutations((fn: (items: Api.Council[]) => Api.Council[]) =>
    mutate(
      key,
      (data: { councils: Api.Council[] } | undefined) => data && { ...data, councils: fn(data.councils) },
      { revalidate: true }
    )
  )
}

/**
 * SWRCouncils type
 */
export type SWRCouncils = ReturnType<typeof useSwrCouncils>

/**
 * constants
 */
const baseKey = "dashboard-councils"

/**
 * utils
 */
const createCouncilMutations = (mutateFn: (fn: (items: Api.Council[]) => Api.Council[]) => void) => {
  return {
    append: (council: Api.Council) => void mutateFn(A.append(council)),
    update: (council: Partial<Api.Council>) =>
      void mutateFn(A.map((c) => (c.id === council.id ? { ...c, ...council } : c))),
    reject: (council: Api.Council) => void mutateFn(A.filter((c) => c.id !== council.id)),
    rejectById: (id: string) => void mutateFn(A.filter((c) => c.id !== id)),
  }
}
