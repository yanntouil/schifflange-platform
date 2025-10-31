import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useSWRConfig } from "swr"
import { useArticlesService } from "./service.context"

/**
 * useSwrArticles
 */
export const useSwrArticles = () => {
  const { service, serviceKey } = useArticlesService()
  const key = useMemoKey(baseKey, { serviceKey })
  const { data, mutate, ...props } = useSWR(
    { fetch: () => service.all({}), key },
    { fallbackData: { articles: [] }, keepPreviousData: true }
  )
  const { articles } = data
  return {
    ...props,
    ...createArticleMutations((fn: (items: Api.ArticleWithRelations[]) => Api.ArticleWithRelations[]) =>
      mutate((data) => data && { ...data, articles: fn(data.articles) }, { revalidate: true })
    ),
    mutate,
    articles,
  }
}

/**
 * useMutateArticles
 */
export const useMutateArticles = () => {
  const { serviceKey } = useArticlesService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createArticleMutations((fn: (items: Api.ArticleWithRelations[]) => Api.ArticleWithRelations[]) =>
    mutate(
      key,
      (data: { articles: Api.ArticleWithRelations[] } | undefined) => data && { ...data, articles: fn(data.articles) },
      { revalidate: true }
    )
  )
}

/**
 * types
 */
export type SWRArticles = ReturnType<typeof useSwrArticles>

/**
 * constants
 */
const baseKey = "dashboard-articles"

/**
 * utils
 */
const createArticleMutations = (
  mutateFn: (fn: (items: Api.ArticleWithRelations[]) => Api.ArticleWithRelations[]) => void
) => {
  return {
    append: (article: Api.ArticleWithRelations) => void mutateFn(A.append(article)),
    update: (article: Partial<Api.ArticleWithRelations>) =>
      void mutateFn(A.map((f) => (f.id === article.id ? { ...f, ...article } : f))),
    reject: (article: Api.ArticleWithRelations) => void mutateFn(A.filter((f) => f.id !== article.id)),
    rejectById: (id: string) => void mutateFn(A.filter((f) => f.id !== id)),
  }
}
