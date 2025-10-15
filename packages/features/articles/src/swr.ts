import { type ContentMutationsHelpers } from "@compo/contents"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useArticlesService } from "./service.context"
/**
 * useSwrCategories
 */
export const useSwrCategories = () => {
  const { service, serviceKey } = useArticlesService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.categories.all({}),
      key: useMemoKey("dashboard-articles-categories", { serviceKey }),
    },
    {
      fallbackData: {
        categories: [],
      },
      keepPreviousData: true,
    }
  )

  const { categories } = data

  // mutation helper
  const mutateCategories = (fn: (items: Api.ArticleCategory[]) => Api.ArticleCategory[]) =>
    mutate((data) => data && { ...data, categories: fn(data.categories) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (category: Api.ArticleCategory) =>
      void mutateCategories(
        (categories) => A.map(categories, (f) => (f.id === category.id ? category : f)) as Api.ArticleCategory[]
      ),
    reject: (category: Api.ArticleCategory) =>
      void mutateCategories((categories) => A.filter(categories, (f) => f.id !== category.id) as Api.ArticleCategory[]),
    rejectById: (id: string) =>
      void mutateCategories((categories) => A.filter(categories, (f) => f.id !== id) as Api.ArticleCategory[]),
    append: (category: Api.ArticleCategory) =>
      void mutateCategories((categories) => A.append(categories, category) as Api.ArticleCategory[]),
  }

  return { categories, ...swr }
}

/**
 * SWRCategories type
 */
export type SWRCategories = ReturnType<typeof useSwrCategories>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * useSwrArticles
 */
export const useSwrArticles = () => {
  const { service, serviceKey } = useArticlesService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.all({}),
      key: useMemoKey("dashboard-articles", { serviceKey }),
    },
    {
      fallbackData: {
        articles: [],
      },
      keepPreviousData: true,
    }
  )

  const { articles } = data

  // mutation helper
  const mutateArticles = (fn: (items: Api.ArticleWithRelations[]) => Api.ArticleWithRelations[]) =>
    mutate((data) => data && { ...data, articles: fn(data.articles) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (article: Partial<Api.ArticleWithRelations>) =>
      void mutateArticles(
        (articles) =>
          A.map(articles, (f) => (f.id === article.id ? { ...f, ...article } : f)) as Api.ArticleWithRelations[]
      ),
    reject: (article: Api.ArticleWithRelations) =>
      void mutateArticles((articles) => A.filter(articles, (f) => f.id !== article.id) as Api.ArticleWithRelations[]),
    rejectById: (id: string) =>
      void mutateArticles((articles) => A.filter(articles, (f) => f.id !== id) as Api.ArticleWithRelations[]),
    append: (article: Api.ArticleWithRelations) =>
      void mutateArticles((articles) => A.append(articles, article) as Api.ArticleWithRelations[]),
  }

  return { articles, ...swr }
}

/**
 * SWRArticles type
 */
export type SWRArticles = ReturnType<typeof useSwrArticles>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

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
 * SWRArticle type
 */
export type SWRArticle = ReturnType<typeof useSwrArticle>
export type SWRSafeArticle = Omit<SWRArticle, "article" | "isLoading" | "isError"> & {
  article: Api.ArticleWithRelations
}

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * reorder
 */
export const reorder =
  (sortedIds: string[] | undefined) =>
  <I extends { id: string }>(items: I[]) =>
    sortedIds
      ? A.map(items, (item) => ({ ...item, order: A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0 }))
      : items
