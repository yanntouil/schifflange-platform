import ExtendedModel from '#models/extended/extended-model'
import User from '#models/user'
import Workspace from '#models/workspace'
import { columnJSON } from '#utils/column-json'
import {
  filterNotificationsValidator,
  sortNotificationsByValidator,
} from '#validators/notifications'
import { beforeCreate, beforeDelete, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import { match } from 'ts-pattern'

/**
 * Model Notification
 */
type Model = Notification
export default class Notification extends ExtendedModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare workspaceId: string | null

  @column()
  declare type: string

  @column()
  declare relatedType: NotificationRelatedType

  @column()
  declare relatedId: string

  @column(columnJSON({}))
  declare metadata: Record<string, unknown>

  @column()
  declare status: NotificationStatus

  @column()
  declare priority: NotificationPriority

  @column.dateTime({ autoCreate: false })
  declare deliveredAt: DateTime | null

  @column.dateTime({ autoCreate: false })
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * RELATED MODELS
   */

  @belongsTo(() => Workspace, { foreignKey: 'relatedId', serializeAs: null })
  declare workspace: BelongsTo<typeof Workspace>

  @belongsTo(() => User, { foreignKey: 'relatedId', serializeAs: null })
  declare user: BelongsTo<typeof User>

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async initResource(notification: Model) {
    notification.status ??= notificationDefaultStatus
    notification.priority ??= notificationDefaultPriority
    notification.metadata ??= {}
  }

  @beforeDelete()
  public static async cleanup(notification: Model) {
    await notification.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SERIALIZERS
   */

  public serializeWithModel() {
    return {
      ...this.serialize(),
      ...match(this.relatedType)
        .with('workspace', () => ({
          workspace: this.workspace?.serialize(),
        }))
        .with('user', () => ({
          user: this.user?.serialize(),
        }))
        .otherwise(() => ({})),
    }
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * SCOPES
   */

  public static filterBy = scope((query, filters: Infer<typeof filterNotificationsValidator>) => {
    if (filters.status) {
      query.where('status', filters.status)
    }
    if (filters.types) {
      query.whereIn('type', filters.types)
    }
    if (filters.priority) {
      query.where('priority', filters.priority)
    }
    if (filters.groupedType) {
      query.where('type', 'like', `${filters.groupedType}-%`)
    }
  })

  public static sortBy = scope((query, sortBy: Infer<typeof sortNotificationsByValidator>) => {
    const { field = 'updatedAt', direction = 'desc' } = sortBy
    if (field === 'type' || field === 'status' || field === 'priority') {
      return query.orderBy(field, direction).orderBy('createdAt', direction)
    }
    return query.orderBy(field, direction)
  })

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public async cleanup() {
    // do nothing atm
  }

  public isLoadedRelation(relation: NonNullable<ExtractModelRelations<Model>>) {
    return !G.isUndefined(D.getUnsafe(this.$preloaded, relation))
  }

  public async getOrLoadRelation<T extends NonNullable<ExtractModelRelations<Model>>>(relation: T) {
    if (!this.isLoadedRelation(relation)) await (this as Model).load(relation)
    return this[relation] as Model[T]
  }
}

/**
 * constants
 */
export const notificationTypes = [
  'account-updated',
  'account-profile-updated',
  'account-deleted',
  'account-takeover',
  'invitation-to-join-workspace',
  'workspace-updated',
  'workspace-deleted',
  'workspace-member-updated',
  'workspace-member-removed',
  'workspace-member-left',
  'workspace-member-attached',
] as const
export type NotificationType = (typeof notificationTypes)[number]
export const notificationGroupedTypes = ['account', 'invitation', 'workspace'] as const
export type NotificationGroupedType = (typeof notificationGroupedTypes)[number]

export const notificationStatuses = ['unread', 'read'] as const
export const notificationDefaultStatus = notificationStatuses[0]
export type NotificationStatus = (typeof notificationStatuses)[number]

export const notificationPriorities = ['low', 'default', 'high'] as const
export const notificationDefaultPriority = notificationPriorities[1]
export type NotificationPriority = (typeof notificationPriorities)[number]

export type NotificationRelatedType = 'workspace' | 'user'
