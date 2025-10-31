import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'libraries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table
        .uuid('workspace_id')
        .nullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')

      table
        .uuid('parent_library_id')
        .nullable()
        .references('id')
        .inTable('libraries')
        .onDelete('CASCADE')

      table.boolean('pin').defaultTo(false)
      table.integer('pin_order').defaultTo(0)

      table.uuid('created_by_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')

      table.uuid('updated_by_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
