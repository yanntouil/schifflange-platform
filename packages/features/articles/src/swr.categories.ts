import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useSWRConfig } from "swr"
import { useArticlesService } from "./service.context"

/**
 * useSwrCategories
 */
export const useSwrCategories = () => {
  const { service, serviceKey } = useArticlesService()
  const key = useMemoKey(baseKey, { serviceKey })
  const { data, mutate, ...props } = useSWR(
    { fetch: () => service.categories.all({}), key },
    { fallbackData: { categories: [] }, keepPreviousData: true }
  )
  const { categories } = data
  return {
    ...props,
    ...createCategoryMutations((fn: (items: Api.ArticleCategory[]) => Api.ArticleCategory[]) =>
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
  const { serviceKey } = useArticlesService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createCategoryMutations((fn: (items: Api.ArticleCategory[]) => Api.ArticleCategory[]) =>
    mutate(
      key,
      (data: { categories: Api.ArticleCategory[] } | undefined) => data && { ...data, categories: fn(data.categories) },
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
const baseKey = "dashboard-articles-categories"

/**
 * utils
 */
const createCategoryMutations = (mutateFn: (fn: (items: Api.ArticleCategory[]) => Api.ArticleCategory[]) => void) => {
  return {
    append: (category: Api.ArticleCategory) => void mutateFn(A.append(category)),
    update: (category: Api.ArticleCategory) => void mutateFn(A.map((f) => (f.id === category.id ? category : f))),
    reject: (category: Api.ArticleCategory) => void mutateFn(A.filter((f) => f.id !== category.id)),
    rejectById: (id: string) => void mutateFn(A.filter((f) => f.id !== id)),
  }
}
