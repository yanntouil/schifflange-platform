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
import Workspace from './workspace.js'

/**
 * Model: WorkspaceLog
 * this model contains workspace-related events for audit purposes
 */
type Model = WorkspaceLog
export default class WorkspaceLog extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare workspaceId: string
  @belongsTo(() => Workspace)
  declare workspace: BelongsTo<typeof Workspace>

  @column()
  declare userId: string | null
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare event: WorkspaceEventType

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
  public static async beforeDelete(ressource: Model) {
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
            query.whereRaw('LOWER(workspace_logs.event) LIKE ?', [`%${term}%`])
            query.orWhereRaw('LOWER(workspace_logs.ip_address) LIKE ?', [`%${term}%`])
            query.orWhereRaw('LOWER(workspace_logs.metadata) LIKE ?', [`%${term}%`])
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
export const workspaceEvents = [
  'created',
  'updated',
  'deleted',
  'member-updated',
  'member-attached',
  'member-removed',
  'member-left',
  'member-joined',
  'invitation-created',
  'invitation-deleted',
] as const

export type WorkspaceEventType = (typeof workspaceEvents)[number]
