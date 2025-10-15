import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'content_items_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('item_id').references('id').inTable('content_items').onDelete('CASCADE')
      table.uuid('file_id').references('id').inTable('media_files').onDelete('CASCADE')
      table.unique(['item_id', 'file_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
