import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'council_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('(UUID())'))
      table.text('agenda').notNullable().defaultTo('')
      table
        .uuid('report_id')
        .nullable()
        .references('id')
        .inTable('media_files')
        .onDelete('SET NULL')
      table
        .uuid('council_id')
        .references('id')
        .inTable('councils')
        .onDelete('CASCADE')
        .notNullable()
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
