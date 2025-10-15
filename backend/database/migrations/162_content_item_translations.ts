import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'content_item_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('content_item_id').references('id').inTable('content_items').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.json('props').defaultTo('{}')
      table.unique(['content_item_id', 'language_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
