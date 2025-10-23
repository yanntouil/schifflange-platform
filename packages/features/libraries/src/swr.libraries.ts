import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useLibrariesService } from "./service.context"
import { SWRChildLibraries } from "./swr.library"

/**
 * useSwrLibraries
 */
export const useSwrLibraries = (query?: Api.Payload.Workspaces.Libraries.Libraries) => {
  const { service, serviceKey } = useLibrariesService()
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.rootIndex(query),
      key: useMemoKey("dashboard-libraries", { serviceKey, query }),
    },
    {
      fallbackData: {
        libraries: [],
      },
      keepPreviousData: true,
    }
  )

  const { libraries } = data

  // mutation helper
  const mutateLibraries = (fn: (items: Api.Library[]) => Api.Library[]) =>
    mutate((data) => data && { ...data, libraries: fn(data.libraries) }, { revalidate: true })

  const swr = {
    ...props,
    mutate,
    update: (library: Partial<Api.Library>) =>
      void mutateLibraries(A.map((f) => (f.id === library.id ? { ...f, ...library } : f))),
    reject: (library: Api.Library) => void mutateLibraries(A.filter((f) => f.id !== library.id)),
    rejectById: (id: string) => void mutateLibraries(A.filter((f) => f.id !== id)),
    append: (library: Api.Library) => void mutateLibraries(A.append(library)),
  }

  return { libraries, ...swr }
}

/**
 * SWRLibraries type
 */
export type SWRLibraries = ReturnType<typeof useSwrLibraries> | SWRChildLibraries

/**
 * useSwrAllLibraries
 */
export const useSwrAllLibraries = () => {
  const { service, serviceKey } = useLibrariesService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.all(),
      key: useMemoKey("dashboard-all-libraries", { serviceKey }),
    },
    {
      fallbackData: { libraries: [] },
      keepPreviousData: true,
    }
  )

  const { libraries } = data

  const swr = { ...props, mutate }

  return { libraries, ...swr }
}
