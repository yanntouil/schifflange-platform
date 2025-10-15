import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'publications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.dateTime('published_at')
      table.dateTime('published_from')
      table.dateTime('published_to')
      table.uuid('published_by_id').references('id').inTable('users').onDelete('SET NULL')

      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
