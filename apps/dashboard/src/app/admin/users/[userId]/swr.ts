import { Api, service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"

/**
 * useSwrUser
 */
export const useSwrUser = (id: string) => {
  const { data, mutate, isLoading, error } = useSWR({
    fetch: service.admin.users.id(id).show,
    key: useMemoKey("admin-users", { id }),
  })

  const user = data?.user

  // mutation helper
  const mutateSessions = (fn: (sessions: Api.Admin.User["sessions"]) => Api.Admin.User["sessions"]) =>
    mutate((data) => data && { ...data, user: { ...data.user, sessions: fn(data.user.sessions) } }, { revalidate: true })
  const swr = {
    isLoading,
    error,
    mutate,
    update: (user: Partial<Api.Admin.User>) => void mutate((data) => data && { ...data, user: { ...data.user, ...user } }),
    rejectSession: (sessionId: string) => void mutateSessions(A.filter((session) => session.id !== sessionId)),
  }

  return { user, swr }
}
