import { useMemoKey, useSWR } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "./service.context"

/**
 * useSwrContact
 */
export const useSwrContact = (contactId: string) => {
  const { service, serviceKey } = useDirectoryService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(contactId).read,
    key: useMemoKey("dashboard-contact", { serviceKey, contactId }),
  })
  // mutation helper
  const mutateContact = (contact: Partial<Api.Contact>) =>
    mutate((data) => data && { ...data, contact: { ...data.contact, ...contact } }, { revalidate: false })

  // memo data
  const contact: Api.Contact | undefined = React.useMemo(() => data?.contact, [data])

  const swr = {
    ...props,
    contactId,
    isError: !props.isLoading && !data,
    mutate,
    mutateContact,
  }

  return { contact, ...swr }
}

/**
 * SWRContact type
 */
export type SWRContact = ReturnType<typeof useSwrContact>
export type SWRSafeContact = Omit<SWRContact, "contact" | "isLoading" | "isError"> & {
  contact: Api.ContactWithRelations
}
