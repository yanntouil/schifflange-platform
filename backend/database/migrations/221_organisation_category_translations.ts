import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organisation_category_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('title', 255).defaultTo('')
      table.text('description').defaultTo('')
      table.uuid('category_id').references('id').inTable('organisation_categories').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.unique(['category_id', 'language_id'], { indexName: 'org_cat_trans_cat_lang_unique' })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
