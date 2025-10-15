import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menus'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('name').notNullable().defaultTo('')
      table.string('location').notNullable().defaultTo('')
      table
        .uuid('workspace_id')
        .nullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
