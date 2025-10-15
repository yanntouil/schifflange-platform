import ExtendedModel from '#models/extended/extended-model'
import User from '#models/user'
import type { WorkspaceRoles } from '#models/workspace'
import Workspace, { workspaceDefaultRole } from '#models/workspace'
import UidService from '#services/uid'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { Secret, base64, safeEqual } from '@adonisjs/core/helpers'
import { beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'
import { createHash } from 'node:crypto'

const prefix = 'wsi:'

/**
 * Model WorkspaceInvitation
 */
type Model = WorkspaceInvitation
export default class WorkspaceInvitation extends ExtendedModel {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * DATABASE
   */

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare value: string

  @column({ serializeAs: null })
  declare hash: string

  @column()
  declare email: string

  @column()
  declare status: WorkspaceInvitationStatuses

  @column()
  declare role: WorkspaceRoles

  @column({ serializeAs: null })
  declare workspaceId: string
  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

  @column({ serializeAs: null })
  declare createdById: string
  @belongsTo(() => User, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof User>

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * HOOKS
   */

  @beforeCreate()
  public static async beforeCreateHook(invitation: Model) {
    invitation.id = UidService.generateUid()
    invitation.role ??= workspaceDefaultRole
    invitation.status ??= workspaceInvitationDefaultStatus
    invitation.deletedAt ??= null
    const { secret, hash } = WorkspaceInvitation.seed(32)
    invitation.value = `${prefix}${base64.urlEncode(String(invitation.id))}.${base64.urlEncode(secret.release())}`
    invitation.hash = hash

    // by default, the token expires in 1 month
    invitation.expiresAt ??= DateTime.now().plus({ months: 1 })
  }

  @beforeDelete()
  public static async beforeDeleteHook(invitation: Model) {
    await invitation.cleanup()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * STATICS
   */

  static decode(value: string): null | { identifier: string; secret: Secret<string> } {
    return AccessToken.decode(prefix, value)
  }

  static seed(size: number) {
    return AccessToken.seed(size)
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * METHODS
   */

  public isExpired() {
    return this.expiresAt && this.expiresAt < DateTime.now()
  }

  public verify(secret: Secret<string>): boolean {
    const newHash = createHash('sha256').update(secret.release()).digest('hex')
    return safeEqual(this.hash, newHash)
  }

  public async cleanup() {
    // nothing to do here - cascade delete is enough
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
export const workspaceInvitationStatusesUpdatable = ['refused', 'accepted'] as const
export const workspaceInvitationStatuses = [
  'pending',
  ...workspaceInvitationStatusesUpdatable,
  'deleted',
] as const
export const workspaceInvitationDefaultStatus = workspaceInvitationStatuses[0]
export type WorkspaceInvitationStatuses = (typeof workspaceInvitationStatuses)[number]
