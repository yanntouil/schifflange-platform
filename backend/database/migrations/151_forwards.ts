import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'forwards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('path').notNullable().index()
      table.uuid('slug_id').references('id').inTable('slugs').onDelete('CASCADE')
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')

      table.dateTime('updated_at').notNullable()
      table.unique(['workspace_id', 'path', 'slug_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
