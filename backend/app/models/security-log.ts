import ExtendedModel from '#models/extended/extended-model'
import User from '#models/user'
import { Infer } from '#start/vine'
import { columnJSON } from '#utils/column-json'
import { makeUnNormalizedTerms } from '#utils/string'
import { filterSecurityLogsValidator } from '#validators/admin/security-logs'
import { beforeDelete, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { A, G, S } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'
import { DateTime } from 'luxon'

/**
 * Model: SecurityLog
 * @description this model contains security-related events for audit purposes
 * ?RGPD: clean-architecture
 */
export default class SecurityLog extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string | null
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare event: SecurityEventType

  @column()
  declare ipAddress: string

  @column(columnJSON<Record<string, any>>({}))
  declare metadata: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeDelete()
  public static async beforeDelete(ressource: SecurityLog) {
    await ressource.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filters: Infer<typeof filterSecurityLogsValidator>) => {
    if (filters.userId) {
      query.where('userId', filters.userId)
    }
    if (filters.event) {
      query.where('event', filters.event)
    }
    if (filters.ipAddress) {
      query.where('ipAddress', filters.ipAddress)
    }
    if (filters.dateFrom) {
      query.where('createdAt', '>=', filters.dateFrom)
    }

    if (filters.dateTo) {
      query.where('createdAt', '<=', filters.dateTo)
    }
  })

  public static search = scope((query, search: Option<string>) => {
    if (G.isNullable(search) || S.isEmpty(search)) return
    const terms = makeUnNormalizedTerms(search)
    if (A.isNotEmpty(terms)) {
      query.where((query) => {
        for (const term of terms) {
          query.where((query) => {
            query.whereRaw('LOWER(security_logs.event) LIKE ?', [`%${term}%`])
            query.orWhereRaw('LOWER(security_logs.ip_address) LIKE ?', [`%${term}%`])
            query.orWhereRaw('LOWER(security_logs.metadata) LIKE ?', [`%${term}%`])
          })
        }
      })
    }
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // nothing to do here
  }
}

/**
 * Security event types
 */
export const securityEvents = [
  'login_success',
  'login_failed',
  'logout',
  'register',
  'email_verified',
  'password_reset_requested',
  'password_reset_completed',
  'email_change_requested',
  'email_change_completed',
  'account_locked',
  'account_unlocked',
  'account_updated',
  'account_deleted',
  'session_created',
  'session_terminated',
  'profile_updated',
  'user_created',
  'user_updated',
  'user_deleted',
  'account_sign_in_as',
] as const

export type SecurityEventType = (typeof securityEvents)[number]
