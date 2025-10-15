import { templateDefaultType, templateTypes } from '#models/template'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.enum('type', templateTypes).notNullable().defaultTo(templateDefaultType)
      table.uuid('content_id').notNullable().references('id').inTable('contents').onDelete('CASCADE')
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE')

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true })
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
