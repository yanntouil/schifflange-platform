import { ContentMutationsHelpers } from "@compo/contents"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { usePagesService } from "./service.context"

/**
 * useSwrPages
 */

export const useSwrPage = (pageId: string) => {
  const { service, serviceKey } = usePagesService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(pageId).read,
    key: useMemoKey("dashboard-page", { serviceKey, pageId }),
  })
  // mutation helper
  const mutatePage = (page: Partial<Api.PageWithRelations>) =>
    mutate((data) => data && { ...data, page: { ...data.page, ...page } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.ContentItem[]) => Api.ContentItem[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          page: { ...data.page, content: { ...data.page.content, items: fn(data.page.content.items) } },
        },
      {
        revalidate: false,
      }
    )
  const mutateSeo = (seo: Api.Seo) =>
    mutate((data) => data && { ...data, page: { ...data.page, seo } }, { revalidate: false })

  // memo data
  const page: Api.PageWithRelations | undefined = React.useMemo(() => data?.page, [data])

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
    pageId,
    isError: !props.isLoading && !data,
    mutate,
    mutatePage,
    mutateSeo,
    ...contentMutations,
  }

  return { page, ...swr }
}

/**
 * types
 */
export type SWRPage = ReturnType<typeof useSwrPage>
export type SWRSafePage = Omit<SWRPage, "page" | "isLoading" | "isError"> & { page: Api.PageWithRelations }

/**
 * utils
 */
export const reorder =
  (sortedIds: string[] | undefined) =>
  <I extends { id: string }>(items: I[]) =>
    sortedIds
      ? A.map(items, (item) => ({ ...item, order: A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0 }))
      : items
