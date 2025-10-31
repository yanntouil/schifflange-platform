import { type ContentMutationsHelpers } from "@compo/contents"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A, D } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useEventsService } from "./service.context"

/**
 * useSwrEvent
 */
export const useSwrEvent = (eventId: string) => {
  const { service, serviceKey } = useEventsService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(eventId).read,
    key: useMemoKey("dashboard-event", { serviceKey, eventId }),
  })
  // mutation helper
  const mutateEvent = (event: Partial<Api.EventWithRelations>) =>
    mutate((data) => data && { ...data, event: { ...data.event, ...event } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.ContentItem[]) => Api.ContentItem[]) =>
    mutate(
      (data) =>
        data &&
        D.set(
          data,
          "event",
          D.set(data.event, "content", D.set(data.event.content, "items", fn(data.event.content.items)))
        ),
      { revalidate: false }
    )
  const mutateSeo = (seo: Api.Seo) =>
    mutate((data) => data && D.set(data, "event", D.set(data.event, "seo", seo)), { revalidate: false })

  const mutatePublication = (publication: Api.Publication) =>
    mutate((data) => data && D.set(data, "event", D.set(data.event, "publication", publication)), { revalidate: false })

  const mutateSchedule = (schedule: Api.Schedule) =>
    mutate((data) => data && D.set(data, "event", D.set(data.event, "schedule", schedule)), { revalidate: false })

  // memo data
  const event = React.useMemo(() => data?.event, [data])

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
    eventId,
    isError: !props.isLoading && !data,
    mutate,
    mutateEvent,
    mutateSeo,
    mutatePublication,
    mutateSchedule,
    ...contentMutations,
  }

  return { event, ...swr }
}

/**
 * SWREvent type
 */
export type SWREvent = ReturnType<typeof useSwrEvent>
export type SWRSafeEvent = Omit<SWREvent, "event" | "isLoading" | "isError"> & {
  event: Api.EventWithRelations
}

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * reorder
 */
export const reorder =
  (sortedIds: string[] | undefined) =>
  <I extends { id: string }>(items: I[]) =>
    sortedIds
      ? A.map(items, (item) => D.set(item, "order", A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0))
      : items
