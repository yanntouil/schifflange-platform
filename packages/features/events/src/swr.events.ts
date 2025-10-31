import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useSWRConfig } from "swr"
import { useEventsService } from "./service.context"

/**
 * useSwrEvents
 */
export const useSwrEvents = () => {
  const { service, serviceKey } = useEventsService()
  const key = useMemoKey(baseKey, { serviceKey })
  const { data, mutate, ...props } = useSWR(
    { fetch: () => service.all({}), key },
    { fallbackData: { events: [] }, keepPreviousData: true }
  )
  const { events } = data
  return {
    ...props,
    ...createEventMutations((fn: (items: Api.EventWithRelations[]) => Api.EventWithRelations[]) =>
      mutate((data) => data && { ...data, events: fn(data.events) }, { revalidate: true })
    ),
    mutate,
    events,
  }
}

/**
 * useMutateEvents
 */
export const useMutateEvents = () => {
  const { serviceKey } = useEventsService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createEventMutations((fn: (items: Api.EventWithRelations[]) => Api.EventWithRelations[]) =>
    mutate(
      key,
      (data: { events: Api.EventWithRelations[] } | undefined) => data && { ...data, events: fn(data.events) },
      { revalidate: true }
    )
  )
}

/**
 * SWREvents type
 */
export type SWREvents = ReturnType<typeof useSwrEvents>

/**
 * constants
 */
const baseKey = "dashboard-events"

/**
 * utils
 */
const createEventMutations = (mutateFn: (fn: (items: Api.EventWithRelations[]) => Api.EventWithRelations[]) => void) => {
  return {
    append: (event: Api.EventWithRelations) => void mutateFn(A.append(event)),
    update: (event: Partial<Api.EventWithRelations>) =>
      void mutateFn(A.map((f) => (f.id === event.id ? { ...f, ...event } : f))),
    reject: (event: Api.EventWithRelations) => void mutateFn(A.filter((f) => f.id !== event.id)),
    rejectById: (id: string) => void mutateFn(A.filter((f) => f.id !== id)),
  }
}
