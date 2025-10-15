import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_category_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('title', 255).defaultTo('')
      table.text('description').defaultTo('')
      table.uuid('image_id').nullable().references('id').inTable('media_files').onDelete('SET NULL')
      table.uuid('category_id').references('id').inTable('project_categories').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.unique(['category_id', 'language_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
