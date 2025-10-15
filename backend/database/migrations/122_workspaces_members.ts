import { workspaceDefaultRole, workspaceRoles } from '#models/workspace'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspaces_members'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').index()
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE').index()
      table.unique(['user_id', 'workspace_id'])
      table.index(['user_id', 'workspace_id'])

      table.enum('role', workspaceRoles).defaultTo(workspaceDefaultRole)
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
