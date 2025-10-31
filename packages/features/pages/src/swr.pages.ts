import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useSWRConfig } from "swr"
import { usePagesService } from "./service.context"

/**
 * useSwrPages
 */
export const useSwrPages = () => {
  const { service, serviceKey } = usePagesService()
  const key = useMemoKey(baseKey, { serviceKey })
  const { data, mutate, ...props } = useSWR(
    { fetch: service.all, key },
    { fallbackData: { pages: [] }, keepPreviousData: true }
  )
  const { pages } = data
  return {
    ...props,
    ...createPageMutations((fn: (items: Api.PageWithRelations[]) => Api.PageWithRelations[]) =>
      mutate((data) => data && { ...data, pages: fn(data.pages) }, { revalidate: true })
    ),
    mutate,
    pages,
  }
}

/**
 * useMutatePages
 */
export const useMutatePages = () => {
  const { serviceKey } = usePagesService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createPageMutations((fn: (items: Api.PageWithRelations[]) => Api.PageWithRelations[]) =>
    mutate(key, (data: { pages: Api.PageWithRelations[] } | undefined) => data && { ...data, pages: fn(data.pages) }, {
      revalidate: true,
    })
  )
}

/**
 * types
 */
export type SWRPages = ReturnType<typeof useSwrPages>

/**
 * constants
 */
const baseKey = "dashboard-pages"

/**
 * utils
 */
const createPageMutations = (mutateFn: (fn: (items: Api.PageWithRelations[]) => Api.PageWithRelations[]) => void) => {
  return {
    append: (page: Api.PageWithRelations) => void mutateFn(A.append(page)),
    update: (page: Partial<Api.PageWithRelations>) =>
      void mutateFn(A.map((f) => (f.id === page.id ? { ...f, ...page } : f))),
    reject: (page: Api.PageWithRelations) => void mutateFn(A.filter((f) => f.id !== page.id)),
    rejectById: (id: string) => void mutateFn(A.filter((f) => f.id !== id)),
  }
}
