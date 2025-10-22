import { useMemoKey, useSWR } from "@compo/hooks"
import { A, D } from "@mobily/ts-belt"
import { type Api } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "./service.context"

/**
 * useSwrOrganisation
 */
export const useSwrOrganisation = (organisationId: string) => {
  const { service, serviceKey } = useDirectoryService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.organisations.id(organisationId).read,
    key: useMemoKey("dashboard-organisation", { serviceKey, organisationId }),
  })
  // mutation helper
  const mutateOrganisation = (organisation: Partial<Api.Organisation>) =>
    mutate((data) => data && { ...data, organisation: { ...data.organisation, ...organisation } }, {
      revalidate: false,
    })

  const mutateChildOrganisations = (fn: (items: Api.Organisation[]) => Api.Organisation[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          organisation: { ...data.organisation, childOrganisations: fn(data.organisation.childOrganisations) },
        },
      { revalidate: false }
    )
  const mutateCO = (fn: (items: Api.ContactOrganisation[]) => Api.ContactOrganisation[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          organisation: D.set(data.organisation, "contactOrganisations", fn(data.organisation.contactOrganisations)),
        },
      { revalidate: false }
    )

  // memo data
  const organisation: Api.OrganisationWithRelations | undefined = React.useMemo(() => data?.organisation, [data])

  const swrChildOrganisations = {
    ...props,
    organisations: data?.organisation?.childOrganisations ?? [],
    mutate: () => mutate(),
    update: (item: Api.Organisation) =>
      mutateChildOrganisations((items) => A.map(items, (f) => (f.id === item.id ? item : f)) as Api.Organisation[]),
    append: (item: Api.Organisation) =>
      mutateChildOrganisations((items) => A.append(items, item) as Api.Organisation[]),
    reject: (item: Api.Organisation) =>
      mutateChildOrganisations((items) => A.filter(items, (f) => f.id !== item.id) as Api.Organisation[]),
    rejectById: (id: string) =>
      mutateChildOrganisations((items) => A.filter(items, (f) => f.id !== id) as Api.Organisation[]),
  }

  const swr = {
    ...props,
    organisationId,
    isError: !props.isLoading && !data,
    mutate,
    mutateOrganisation,
    // merge each time contact found in contactOrganisations
    updateContact: (contact: Api.Contact) =>
      mutateCO((items) =>
        A.map(items, (co) =>
          D.set(co, "contact", co.contact.id === contact.id ? { ...co.contact, ...contact } : co.contact)
        )
      ),
    rejectContactById: (id: string) => mutateCO((items) => A.filter(items, ({ contactId }) => contactId !== id)),

    updateContactOrganisation: (item: Api.ContactOrganisation) =>
      mutateCO(A.map((co) => (co.id === item.id ? item : co))),
    appendContactOrganisation: (item: Api.ContactOrganisation) => mutateCO(A.append(item)),
    rejectContactOrganisation: (item: Api.ContactOrganisation) => mutateCO(A.filter((co) => co.id !== item.id)),
    rejectContactOrganisationById: (id: string) => mutateCO(A.filter((co) => co.id !== id)),
    swrChildOrganisations,
  }

  return { organisation, ...swr }
}

/**
 * SWROrganisation type
 */
export type SWROrganisation = ReturnType<typeof useSwrOrganisation>
export type SWRSafeOrganisation = Omit<SWROrganisation, "organisation" | "isLoading" | "isError"> & {
  organisation: Api.OrganisationWithRelations
}
export type SWRChildOrganisations = ReturnType<typeof useSwrOrganisation>["swrChildOrganisations"]
