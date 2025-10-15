import { projectTagType } from '#models/project-tag'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.integer('order').unsigned().defaultTo(0)
      table.enum('type', projectTagType).defaultTo('non_formal_education')
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
