import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'library_document_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('library_document_id').references('id').inTable('library_documents').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')

      table.string('title', 255).defaultTo('')
      table.text('description').defaultTo('')

      table.unique(['library_document_id', 'language_id'], { indexName: 'library_doc_trans_doc_lang_unique' })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
