import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slugs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('slug').notNullable().index()
      table.string('path').notNullable().index()

      table.string('model').notNullable()

      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
