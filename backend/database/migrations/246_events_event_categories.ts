import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events_event_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable()
      table
        .uuid('category_id')
        .references('id')
        .inTable('event_categories')
        .onDelete('CASCADE')
        .notNullable()
      table.primary(['event_id', 'category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
