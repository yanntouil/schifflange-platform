import { Api, service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A, D } from "@compo/utils"
import { useUsersStore } from "./store"

/**
 * useSwrUsers
 */
export const useSwrUsers = () => {
  const query = useUsersStore(D.prop("query"))
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.admin.users.list(query),
      key: useMemoKey("admin-users", { ...query }),
    },
    {
      fallbackData: {
        metadata: service.fallbackMetadata,
        users: [],
        total: 0,
      },
    }
  )

  const { users, total, metadata } = data

  // mutation helper
  const mutateUsers = (fn: (items: Api.Admin.User[]) => Api.Admin.User[]) =>
    mutate((data) => data && { ...data, users: fn(data.users) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (user: Api.Admin.User) => void mutateUsers(A.map((f) => (f.id === user.id ? user : f))),
    reject: (user: Api.Admin.User) => void mutateUsers(A.filter((f) => f.id !== user.id)),
    rejectById: (id: string) => void mutateUsers(A.filter((f) => f.id !== id)),
    append: (user: Api.Admin.User) => void mutateUsers(A.append(user)),
  }

  return { users, metadata, total, swr }
}
