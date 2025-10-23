import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'library_documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('library_id').references('id').inTable('libraries').onDelete('CASCADE')
      table.string('reference', 255).notNullable()

      table.uuid('publication_id').nullable().references('id').inTable('publications').onDelete('CASCADE')
      table.uuid('tracking_id').references('id').inTable('trackings').onDelete('CASCADE')

      table.uuid('workspace_id').nullable().references('id').inTable('workspaces').onDelete('CASCADE')

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
