import Notification, { NotificationRelatedType, NotificationType } from '#models/notification'
import User from '#models/user'
import Workspace, { WorkspaceRoles } from '#models/workspace'
import WorkspaceMember from '#models/workspace-member'
import { LucidRow } from '@adonisjs/lucid/types/model'
import transmit from '@adonisjs/transmit/services/main'
import { A, D } from '@mobily/ts-belt'
import { DateTime } from 'luxon'
import { match, P } from 'ts-pattern'
import { v4 as uuid } from 'uuid'

export default class NotificationService {
  static async notify(payload: NotificationPayload) {
    const users = await this.resolveTarget(payload)
    if (users.length === 0) return
    const model = await this.resolveModel(payload)
    for (const user of users) {
      const config = user.config
      const prefs = D.get(config?.notifications, payload.type) ?? { push: true, email: true }

      if (prefs.push !== false) {
        await this.pushNotification(user, model, payload)
      }
      if (prefs.email === true) {
        await this.sendEmail(user, model, payload)
      }
    }
  }

  /**
   * Resolve the target from the payload
   * @param payload - The payload to resolve the target from
   * @returns The target
   */
  private static async resolveTarget(payload: Pick<NotificationPayload, 'target'>) {
    const userIds = await match(payload.target)
      .with({ user: P.string }, async ({ user }) => [user])
      .with({ workspace: P.string, roles: P.array(P.string) }, async ({ workspace, roles }) => {
        const members = await WorkspaceMember.query()
          .where('workspace_id', workspace)
          .whereIn('role', roles)
          .select('user_id')
        return A.map(members, D.prop('userId'))
      })
      .with({ users: P.array(P.string) }, async ({ users }) => users)
      .otherwise(() => [])

    return await User.query()
      .whereIn('id', [...userIds])
      .preload('config')
      .preload('profile')
  }

  /**
   * Resolve the model from the payload
   * @param payload - The payload to resolve the model from
   * @returns The model
   */
  private static async resolveModel(
    payload: Pick<NotificationPayload, 'relatedType' | 'relatedId'>
  ) {
    return await match(payload)
      .with({ relatedType: 'user', relatedId: P.string }, async ({ relatedId }) => ({
        user: await User.query().where('id', relatedId).first(),
      }))
      .with({ relatedType: 'workspace', relatedId: P.string }, async ({ relatedId }) => ({
        workspace: await Workspace.query().where('id', relatedId).first(),
      }))
      .exhaustive()
  }

  /**
   * Push notification to the target
   * @param notif - The notification to push
   * @returns The notification
   */
  private static async pushNotification(
    user: User,
    model: ResolvedModel,
    payload: NotificationPayload
  ) {
    const notif = await Notification.create({
      id: uuid(),
      userId: user.id,
      workspaceId: user.workspaceId,
      type: payload.type,
      relatedType: payload.relatedType,
      relatedId: payload.relatedId,
      metadata: payload.metadata,
      status: 'unread',
      priority: payload.priority ?? 'default',
      expiresAt: payload.expiresAt ?? null,
    })
    notif.$preloaded = model as Record<string, LucidRow>
    transmit.broadcast(`notification/${user.id}`, notif.serializeWithModel())
  }

  /**
   * Send email to the target
   * @param notif - The notification to send
   * @returns The notification
   */
  private static async sendEmail(user: User, model: ResolvedModel, payload: NotificationPayload) {
    user // ts fix warning
    model // ts fix warning
    payload // ts fix warning
    // emitter.emit(`notification:${notif.userId}`, notif)
  }
}

/**
 * TYPES
 */
type ResolvedModel = Awaited<ReturnType<(typeof NotificationService)['resolveModel']>>
export type NotificationTarget =
  | { user: string }
  | { workspace: string; roles?: WorkspaceRoles[] }
  | { users: string[] }
export type NotificationPayload = {
  type: NotificationType
  relatedType: NotificationRelatedType
  relatedId: string
  metadata?: Record<string, unknown>
  target: NotificationTarget
  priority?: 'low' | 'default' | 'high'
  expiresAt?: DateTime | null
}
