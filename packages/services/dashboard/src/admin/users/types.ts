import { User as BaseUser, UserRole, UserStatus, WithEmail, WithLanguage, WithSessions } from "../../types"

export type User = BaseUser & WithSessions & WithLanguage & WithEmail
export type UserStats = {
  totalUsers: number
  activeUsersToday: number
  activeUsersThisWeek: number
  activeUsersThisMonth: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  deletedUsersThisMonth: number
  inactiveUsersOver30Days: number
  usersByRole: Record<UserRole, number>
  usersByStatus: Record<UserStatus, number>
  activityByDay: Array<{ date: string; activeUsers: number; newUsers: number }>
  topActiveUsers: Array<BaseUser & WithEmail & { lastActiveAt: string; sessionCount: number }>
}
