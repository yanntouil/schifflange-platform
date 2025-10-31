import { type ContentMutationsHelpers } from "@compo/contents"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useArticlesService } from "./service.context"

/**
 * useSwrArticle
 */
export const useSwrArticle = (articleId: string) => {
  const { service, serviceKey } = useArticlesService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(articleId).read,
    key: useMemoKey("dashboard-article", { serviceKey, articleId }),
  })
  // mutation helper
  const mutateArticle = (article: Partial<Api.ArticleWithRelations>) =>
    mutate((data) => data && { ...data, article: { ...data.article, ...article } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.ContentItem[]) => Api.ContentItem[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          article: { ...data.article, content: { ...data.article.content, items: fn(data.article.content.items) } },
        },
      {
        revalidate: false,
      }
    )
  const mutateSeo = (seo: Api.Seo) =>
    mutate((data) => data && { ...data, article: { ...data.article, seo } }, { revalidate: false })
  const mutatePublication = (publication: Api.Publication) =>
    mutate((data) => data && { ...data, article: { ...data.article, publication } }, { revalidate: false })

  // memo data
  const article: Api.ArticleWithRelations | undefined = React.useMemo(() => data?.article, [data])

  const contentMutations: ContentMutationsHelpers = {
    reorderItems: (sortedIds: string[]) =>
      mutateItems((items) => {
        const reordered = reorder(sortedIds)(items)
        return (Array.isArray(reordered) ? reordered : items) as Api.ContentItem[]
      }),
    updateItem: (item: Api.ContentItem) =>
      mutateItems((items) => A.map(items, (f) => (f.id === item.id ? item : f)) as Api.ContentItem[]),
    appendItem: (item: Api.ContentItem, sortedIds?: string[]) =>
      mutateItems((items) => {
        const appended = A.append(items, item) as Api.ContentItem[]
        const reordered = sortedIds ? reorder(sortedIds)(appended) : appended
        return (Array.isArray(reordered) ? reordered : appended) as Api.ContentItem[]
      }),
    rejectItem: (item: Api.ContentItem, sortedIds?: string[]) =>
      mutateItems((items) => {
        const filtered = A.filter(items, (f) => f.id !== item.id) as Api.ContentItem[]
        const reordered = sortedIds ? reorder(sortedIds)(filtered) : filtered
        return (Array.isArray(reordered) ? reordered : filtered) as Api.ContentItem[]
      }),
  }

  const swr = {
    ...props,
    articleId,
    isError: !props.isLoading && !data,
    mutate,
    mutateArticle,
    mutateSeo,
    mutatePublication,
    ...contentMutations,
  }

  return { article, ...swr }
}

/**
 * types
 */
export type SWRArticle = ReturnType<typeof useSwrArticle>
export type SWRSafeArticle = Omit<SWRArticle, "article" | "isLoading" | "isError"> & {
  article: Api.ArticleWithRelations
}

/**
 * utils
 */
export const reorder =
  (sortedIds: string[] | undefined) =>
  <I extends { id: string }>(items: I[]) =>
    sortedIds
      ? A.map(items, (item) => ({ ...item, order: A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0 }))
      : items
