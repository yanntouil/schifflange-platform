import { workspaceDefaultRole, workspaceRoles } from '#models/workspace'
import {
  workspaceInvitationDefaultStatus,
  workspaceInvitationStatuses,
} from '#models/workspaces-invitation'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspace_invitations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('value').notNullable()
      table.string('hash').notNullable().unique()
      table.string('email', 255).index()
      table.enum('status', workspaceInvitationStatuses).defaultTo(workspaceInvitationDefaultStatus)
      table.enum('role', workspaceRoles).defaultTo(workspaceDefaultRole)

      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE').index()
      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('expires_at', { useTz: true }).index()
      table.index(['workspace_id', 'email'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
