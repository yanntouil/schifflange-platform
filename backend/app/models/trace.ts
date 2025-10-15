import ExtendedModel from '#models/extended/extended-model'
import Tracking from '#models/tracking'
import Workspace from '#models/workspace'
import type { UserAgent } from '#services/utils/user-agent'
import { columnJSON } from '#utils/column-json'
import { DateOrIntervalJs, DateOrIntervalLuxon, luxonOrJsDate } from '#utils/date'
import { belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Model Trace
 */
export default class Trace extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare sessionId: string

  @column()
  declare sessionDuration: number

  @column()
  declare isAuth: boolean
  @column()
  declare isBot: boolean

  @column(columnJSON<UserAgent>({ client: {}, os: {}, device: {}, bot: {}, coords: {} }))
  declare userAgent: UserAgent

  @column()
  declare trackingId: string
  @belongsTo(() => Tracking, { foreignKey: 'trackingId' })
  declare tracking: BelongsTo<typeof Tracking>

  @column()
  declare workspaceId: string | null
  @belongsTo(() => Workspace)
  declare workspace: BelongsTo<typeof Workspace>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */
  public static workspace = scope((query, workspace?: Workspace | null) => {
    if (G.isNullable(workspace)) return query.whereNull('workspaceId')
    return query.where('workspaceId', workspace.id)
  })
  public static whereDateOrInterval = scope(
    (query, dates: DateOrIntervalLuxon | DateOrIntervalJs) => {
      const { from, to, date } = D.map(dates, luxonOrJsDate)
      // exact date
      if (G.isNotNullable(date))
        return query.where((query) =>
          query
            .where('createdAt', '>=', date.startOf('day').toSQL() ?? '')
            .andWhere('createdAt', '<=', date.endOf('day').toSQL() ?? '')
        )
      // between from and to
      if (G.isNotNullable(from) && G.isNotNullable(to) && from < to)
        return query.where((query) =>
          query
            .where('createdAt', '>=', from.startOf('day').toSQL() ?? '')
            .andWhere('createdAt', '<=', to.endOf('day').toSQL() ?? '')
        )
      // after from
      if (G.isNotNullable(from))
        return query.where((query) =>
          query.where('createdAt', '>=', from.startOf('day').toSQL() ?? '')
        )
      // before to
      if (G.isNotNullable(to))
        return query.where((query) => query.where('createdAt', '<=', to.endOf('day').toSQL() ?? ''))
      return query
    }
  )
}
