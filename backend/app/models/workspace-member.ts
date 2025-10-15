import ExtendedModel from '#models/extended/extended-model'
import User from '#models/user'
import type { WorkspaceRoles } from '#models/workspace'
import Workspace from '#models/workspace'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

/**
 * Model WorkspaceMember
 * this model is a pivot table between users and workspaces
 * It is mainly used for maintenance and not for regular use
 */
export default class WorkspaceMember extends ExtendedModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column()
  declare workspaceId: string

  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

  @column()
  declare role: WorkspaceRoles

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
