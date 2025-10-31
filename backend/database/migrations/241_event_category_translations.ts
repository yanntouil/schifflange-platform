import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_category_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table
        .uuid('category_id')
        .references('id')
        .inTable('event_categories')
        .onDelete('CASCADE')
        .notNullable()
      table
        .uuid('language_id')
        .references('id')
        .inTable('languages')
        .onDelete('CASCADE')
        .notNullable()

      table.string('title', 255).notNullable().defaultTo('')
      table.text('description').notNullable().defaultTo('')
      table.uuid('image_id').references('id').inTable('media_files').onDelete('SET NULL').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
