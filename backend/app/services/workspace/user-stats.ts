import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * UserStatsService
 * This service provides methods to get user stats
 */
export default class UserStatsService {
  /**
   * allStats
   * Returns the stats for the users
   */
  public static async allStats(days: number = 30) {
    return {
      totalUsers: await this.totalUsers(),
      activeUsersToday: await this.activeUsersToday(),
      activeUsersThisWeek: await this.activeUsersThisWeek(),
      activeUsersThisMonth: await this.activeUsersThisMonth(),
      newUsersToday: await this.newUsersToday(),
      newUsersThisWeek: await this.newUsersThisWeek(),
      newUsersThisMonth: await this.newUsersThisMonth(),
      deletedUsersThisMonth: await this.deletedUsersThisMonth(),
      inactiveUsersOver30Days: await this.inactiveUsersOver30Days(),
      usersByRole: await this.usersByRole(),
      usersByStatus: await this.usersByStatus(),
      activityByDay: await this.activityByDay(days),
      topActiveUsers: await this.topActiveUsers(),
    }
  }

  /**
   * getTotalUsers
   * Returns the total number of users
   */
  public static async totalUsers(): Promise<number> {
    const result = A.head(await db.from('users').count('*', 'total'))
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getActiveUsersToday
   * Returns the number of active users today
   */
  public static async activeUsersToday(): Promise<number> {
    const today = DateTime.now().startOf('day')
    const result = A.head(
      await db
        .from('security_logs')
        .where('event', 'login_success')
        .andWhere('created_at', '>=', today.toSQL({ includeOffset: false }))
        .distinct('user_id')
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getActiveUsersThisWeek
   * Returns the number of active users today
   */
  public static async activeUsersThisWeek(): Promise<number> {
    const weekStart = DateTime.now().startOf('week')
    const result = A.head(
      await db
        .from('security_logs')
        .where('event', 'login_success')
        .andWhere('created_at', '>=', weekStart.toSQL({ includeOffset: false }))
        .distinct('user_id')
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getActiveUsersThisMonth
   * Returns the number of active users this month
   */
  public static async activeUsersThisMonth(): Promise<number> {
    const monthStart = DateTime.now().startOf('month')
    const result = A.head(
      await db
        .from('security_logs')
        .where('event', 'login_success')
        .andWhere('created_at', '>=', monthStart.toSQL({ includeOffset: false }))
        .distinct('user_id')
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getNewUsersToday
   * Returns the number of new users today
   */
  public static async newUsersToday(): Promise<number> {
    const today = DateTime.now().startOf('day')
    const result = A.head(
      await db
        .from('users')
        .where('created_at', '>=', today.toSQL({ includeOffset: false }))
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getNewUsersThisWeek
   * Returns the number of new users this week
   */
  public static async newUsersThisWeek(): Promise<number> {
    const weekStart = DateTime.now().startOf('week')
    const result = A.head(
      await db
        .from('users')
        .where('created_at', '>=', weekStart.toSQL({ includeOffset: false }))
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getNewUsersThisMonth
   * Returns the number of new users this month
   */
  public static async newUsersThisMonth(): Promise<number> {
    const monthStart = DateTime.now().startOf('month')
    const result = A.head(
      await db
        .from('users')
        .where('created_at', '>=', monthStart.toSQL({ includeOffset: false }))
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getDeletedUsersThisMonth
   * Returns the number of deleted users this month
   */
  public static async deletedUsersThisMonth(): Promise<number> {
    const monthStart = DateTime.now().startOf('month')
    const result = A.head(
      await db
        .from('users')
        .where('deleted_at', '>=', monthStart.toSQL({ includeOffset: false }))
        .count('*', 'total')
    )
    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getInactiveUsersOver30Days
   * Returns the number of users who haven't been active for over 30 days
   */
  public static async inactiveUsersOver30Days(): Promise<number> {
    const cutoff = DateTime.now().minus({ days: 30 }).startOf('day')

    const result = A.head(
      await db
        .from('users')
        .where('created_at', '<', cutoff.toSQL({ includeOffset: false }))
        .andWhereNotIn('id', (subquery) =>
          subquery
            .from('security_logs')
            .select('user_id')
            .distinct()
            .where('event', 'login_success')
            .where('created_at', '>=', cutoff.toSQL({ includeOffset: false }))
        )
        .count('* as total')
    )

    const total = G.isNumber(result?.total) ? result.total : 0
    return total
  }

  /**
   * getUsersByRole
   * Returns the number of users grouped by their role
   */
  public static async usersByRole(): Promise<Record<string, number>> {
    const rows = await db.from('users').select('role').count('* as total').groupBy('role')

    return A.reduce(rows, {}, (acc, row) => ({
      ...acc,
      [row.role]: G.isNumber(row.total) ? row.total : Number(row.total),
    }))
  }

  /**
   * getUsersByRole
   * Returns the number of users grouped by their role
   */
  public static async usersByStatus(): Promise<Record<string, number>> {
    const rows = await db.from('users').select('status').count('* as total').groupBy('status')

    return A.reduce(rows, {}, (acc, row) => ({
      ...acc,
      [row.role]: G.isNumber(row.total) ? row.total : Number(row.total),
    }))
  }

  /**
   * getActivityByDay
   * Returns the number of active and new users per day for the last N days
   * todo : dont forget to remove the randomRange use to test frontend
   */
  public static async activityByDay(
    days: number = 30
  ): Promise<Array<{ date: string; activeUsers: number; newUsers: number }>> {
    const now = DateTime.now().startOf('day')
    const startDate = now.minus({ days })

    // Group login activity by day
    // const activity = await db
    //   .from('security_logs')
    //   .select(db.raw('DATE(created_at) as date'))
    //   .countDistinct('user_id as activeUsers')
    //   .where('event', 'login_success')
    //   .andWhere('created_at', '>=', startDate.toSQL({ includeOffset: false }))
    //   .groupByRaw('DATE(created_at)')

    // Group new users by day
    // const registrations = await db
    //   .from('users')
    //   .select(db.raw('DATE(created_at) as date'))
    //   .count('* as newUsers')
    //   .where('created_at', '>=', startDate.toSQL({ includeOffset: false }))
    //   .groupByRaw('DATE(created_at)')

    // const registrationsMap = D.fromPairs(
    //   registrations.map((r) => [r.date, G.isNumber(r.newUsers) ? r.newUsers : Number(r.newUsers)])
    // )

    // const activityMap = D.fromPairs(
    //   activity.map((a) => [
    //     a.date,
    //     G.isNumber(a.activeUsers) ? a.activeUsers : Number(a.activeUsers),
    //   ])
    // )

    // Generate result for each day
    const range = A.range(0, days - 1)

    return [
      ...A.map(range, (i) => {
        const date = startDate.plus({ days: i }).toISODate()
        return {
          date,
          activeUsers: randomRange(7, 100), //activityMap[date] ?? 0,
          newUsers: randomRange(0, 5), //registrationsMap[date] ?? 0,
        }
      }),
    ]
  }

  /**
   * getTopActiveUsers
   * Returns the top N users with the most login activity in the last X days
   */
  public static async topActiveUsers(limit: number = 10, days: number = 30) {
    const cutoff = DateTime.now().minus({ days }).startOf('day').toSQL({ includeOffset: false })

    const rows = await db
      .from('security_logs')
      .select('users.id')
      .select(db.raw('MAX(security_logs.created_at) as lastActiveAt'))
      .count('* as sessionCount')
      .where('security_logs.event', 'login_success')
      .andWhere('security_logs.created_at', '>=', cutoff)
      .innerJoin('users', 'users.id', 'security_logs.user_id')
      .groupBy('users.id')
      .orderBy('sessionCount', 'desc')
      .limit(limit)

    const ids = A.map(rows, D.prop('id')) as string[]

    const users = await User.query().whereIn('id', ids).preload('profile')

    return A.map(users, (user) => {
      const match = rows.find((r) => r.id === user.id)
      return {
        ...user.serializeInAdmin(),
        sessionCount: G.isNumber(match?.sessionCount)
          ? match.sessionCount
          : Number(match?.sessionCount ?? 0),
        lastActiveAt: match?.lastActiveAt ?? '',
      }
    })
  }
}

/**
 * utils
 */

const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
