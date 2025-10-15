import { Api, service } from "@/services"
import { useSWR } from "@compo/hooks"

/**
 * useSwrStats
 * SWR hook to fetch the stats of the users
 */
export const useSwrStats = () => {
  const { data, ...swr } = useSWR(
    {
      fetch: service.admin.users.stats,
      key: "admin-users-stats",
    },
    { fallbackData }
  )

  const { stats } = data
  return { stats, swr }
}

const fallbackData = {
  stats: {
    totalUsers: 0,
    activeUsersToday: 0,
    activeUsersThisWeek: 0,
    activeUsersThisMonth: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    deletedUsersThisMonth: 0,
    inactiveUsersOver30Days: 0,
    usersByRole: {
      admin: 0,
      member: 0,
      superadmin: 0,
    },
    usersByStatus: {
      active: 0,
      deleted: 0,
      pending: 0,
      suspended: 0,
    },
    activityByDay: [],
    topActiveUsers: [],
  } satisfies Api.Admin.UserStats,
}
