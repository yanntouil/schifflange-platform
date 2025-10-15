import {
  workspaceDefaultStatus,
  workspaceDefaultType,
  workspaceStatuses,
  workspaceTypes,
} from '#models/workspace'
import FileService from '#services/files/file'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspaces'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('name', 50).notNullable()
      table.json('image').defaultTo(FileService.emptyImage)
      table.enum('status', workspaceStatuses).defaultTo(workspaceDefaultStatus)
      table.enum('type', workspaceTypes).defaultTo(workspaceDefaultType)
      table.json('config').defaultTo({})

      table.dateTime('deleted_at').nullable()
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })

      table.uuid('theme_id').references('id').inTable('workspace_themes').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
