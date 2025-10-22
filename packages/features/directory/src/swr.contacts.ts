import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useDirectoryService } from "./service.context"

/**
 * useSwrContacts
 */
export const useSwrContacts = () => {
  const { service, serviceKey } = useDirectoryService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.all({}),
      key: useMemoKey("dashboard-articles-categories", { serviceKey }),
    },
    {
      fallbackData: {
        contacts: [],
      },
      keepPreviousData: true,
    }
  )

  const { contacts } = data

  // mutation helper
  const mutateContacts = (fn: (items: Api.Contact[]) => Api.Contact[]) =>
    mutate((data) => data && { ...data, contacts: fn(data.contacts) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (contact: Api.Contact) =>
      void mutateContacts((contacts) => A.map(contacts, (f) => (f.id === contact.id ? contact : f)) as Api.Contact[]),
    reject: (contact: Api.Contact) =>
      void mutateContacts((contacts) => A.filter(contacts, (f) => f.id !== contact.id) as Api.Contact[]),
    rejectById: (id: string) =>
      void mutateContacts((contacts) => A.filter(contacts, (f) => f.id !== id) as Api.Contact[]),
    append: (contact: Api.Contact) => void mutateContacts((contacts) => A.append(contacts, contact) as Api.Contact[]),
  }

  return { contacts, ...swr }
}

/**
 * SWRContacts type
 */
export type SWRContacts = ReturnType<typeof useSwrContacts>
