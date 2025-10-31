import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('(UUID())'))
      table.json('props').notNullable().defaultTo({})

      table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable()
      table
        .uuid('language_id')
        .references('id')
        .inTable('languages')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
