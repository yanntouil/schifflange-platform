import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'content_items_slugs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('item_id').references('id').inTable('content_items').onDelete('CASCADE')
      table.uuid('slug_id').references('id').inTable('slugs').onDelete('CASCADE')
      table.unique(['item_id', 'slug_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
