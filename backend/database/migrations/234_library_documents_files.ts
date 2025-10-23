import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'library_documents_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid('library_document_id')
        .references('id')
        .inTable('library_documents')
        .onDelete('CASCADE')
      table.uuid('file_id').references('id').inTable('media_files').onDelete('CASCADE')
      table.string('code', 100).notNullable().defaultTo('')

      table.primary(['library_document_id', 'file_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
