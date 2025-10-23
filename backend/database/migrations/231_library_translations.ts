import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'library_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('library_id').references('id').inTable('libraries').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')

      table.string('title', 255).defaultTo('')
      table.text('description').defaultTo('')

      table.unique(['library_id', 'language_id'], { indexName: 'library_trans_library_lang_unique' })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
