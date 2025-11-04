import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'councils'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('(UUID())'))
      table.timestamp('date').notNullable()
      table.json('video').notNullable().defaultTo({})

      table
        .uuid('workspace_id')
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')
        .notNullable()
      table.index(['workspace_id'])

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
