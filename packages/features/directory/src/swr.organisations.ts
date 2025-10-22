import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useDirectoryService } from "./service.context"
import { SWRChildOrganisations } from "./swr.organisation"

/**
 * useSwrOrganisations
 */
export const useSwrOrganisations = (query?: Api.Payload.Workspaces.Directory.Organisations) => {
  const { service, serviceKey } = useDirectoryService()
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.organisations.rootIndex(query),
      key: useMemoKey("dashboard-organisations", { serviceKey, query }),
    },
    {
      fallbackData: {
        organisations: [],
      },
      keepPreviousData: true,
    }
  )

  const { organisations } = data

  // mutation helper
  const mutateOrganisations = (fn: (items: Api.Organisation[]) => Api.Organisation[]) =>
    mutate((data) => data && { ...data, organisations: fn(data.organisations) }, { revalidate: true })

  const swr = {
    ...props,
    mutate,
    update: (organisation: Partial<Api.Organisation>) =>
      void mutateOrganisations(
        (organisations) =>
          A.map(organisations, (f) => (f.id === organisation.id ? { ...f, ...organisation } : f)) as Api.Organisation[]
      ),
    reject: (organisation: Api.Organisation) =>
      void mutateOrganisations(
        (organisations) => A.filter(organisations, (f) => f.id !== organisation.id) as Api.Organisation[]
      ),
    rejectById: (id: string) =>
      void mutateOrganisations((organisations) => A.filter(organisations, (f) => f.id !== id) as Api.Organisation[]),
    append: (organisation: Api.Organisation) =>
      void mutateOrganisations((organisations) => A.append(organisations, organisation) as Api.Organisation[]),
  }

  return { organisations, ...swr }
}

/**
 * SWROrganisations type
 */
export type SWROrganisations = ReturnType<typeof useSwrOrganisations> | SWRChildOrganisations

/**
 * useSwrOrganisations
 */
export const useSwrAllOrganisations = () => {
  const { service, serviceKey } = useDirectoryService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.organisations.all(),
      key: useMemoKey("dashboard-organisations", { serviceKey }),
    },
    {
      fallbackData: {
        organisations: [],
      },
      keepPreviousData: true,
    }
  )

  const { organisations } = data

  const swr = {
    ...props,
    mutate,
  }

  return { organisations, ...swr }
}
