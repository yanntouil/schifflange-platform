import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useSWRConfig } from "swr"
import { useEventsService } from "./service.context"

/**
 * useSwrCategories
 */
export const useSwrCategories = () => {
  const { service, serviceKey } = useEventsService()
  const key = useMemoKey(baseKey, { serviceKey })
  const { data, mutate, ...props } = useSWR(
    { fetch: () => service.categories.all({}), key },
    { fallbackData: { categories: [] }, keepPreviousData: true }
  )
  const { categories } = data
  return {
    ...props,
    ...createCategoryMutations((fn: (items: Api.EventCategory[]) => Api.EventCategory[]) =>
      mutate((data) => data && { ...data, categories: fn(data.categories) }, { revalidate: true })
    ),
    mutate,
    categories,
  }
}

/**
 * useMutateCategories
 */
export const useMutateCategories = () => {
  const { serviceKey } = useEventsService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createCategoryMutations((fn: (items: Api.EventCategory[]) => Api.EventCategory[]) =>
    mutate(
      key,
      (data: { categories: Api.EventCategory[] } | undefined) => data && { ...data, categories: fn(data.categories) },
      { revalidate: true }
    )
  )
}

/**
 * types
 */
export type SWRCategories = ReturnType<typeof useSwrCategories>

/**
 * constants
 */
const baseKey = "dashboard-events-categories"

/**
 * utils
 */
const createCategoryMutations = (mutateFn: (fn: (items: Api.EventCategory[]) => Api.EventCategory[]) => void) => {
  return {
    append: (category: Api.EventCategory) => void mutateFn(A.append(category)),
    update: (category: Api.EventCategory) => void mutateFn(A.map((f) => (f.id === category.id ? category : f))),
    reject: (category: Api.EventCategory) => void mutateFn(A.filter((f) => f.id !== category.id)),
    rejectById: (id: string) => void mutateFn(A.filter((f) => f.id !== id)),
  }
}
