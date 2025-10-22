import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useDirectoryService } from "./service.context"

/**
 * useSwrCategories
 */
export const useSwrCategories = (query?: Api.Payload.Workspaces.Directory.OrganisationsCategories) => {
  const { service, serviceKey } = useDirectoryService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.organisations.categories.all(query),
      key: useMemoKey("dashboard-organisation-categories", { serviceKey, query }),
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
  const mutateCategories = (fn: (items: Api.OrganisationCategory[]) => Api.OrganisationCategory[]) =>
    mutate((data) => data && { ...data, categories: fn(data.categories) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (category: Partial<Api.OrganisationCategory>) =>
      void mutateCategories(
        (articles) =>
          A.map(categories, (f) => (f.id === category.id ? { ...f, ...category } : f)) as Api.OrganisationCategory[]
      ),
    reject: (category: Api.OrganisationCategory) =>
      void mutateCategories(
        (categories) => A.filter(categories, (f) => f.id !== category.id) as Api.OrganisationCategory[]
      ),
    rejectById: (id: string) =>
      void mutateCategories((categories) => A.filter(categories, (f) => f.id !== id) as Api.OrganisationCategory[]),
    append: (category: Api.OrganisationCategory) =>
      void mutateCategories((categories) => A.append(categories, category) as Api.OrganisationCategory[]),
  }

  return { categories, ...swr }
}

/**
 * SWRCategories type
 */
export type SWRCategories = ReturnType<typeof useSwrCategories>
