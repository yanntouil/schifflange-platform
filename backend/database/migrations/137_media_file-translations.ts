import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media_file_translations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('name', 255).defaultTo('')
      table.string('alt', 255).defaultTo('')
      table.text('caption', 'medium').defaultTo('')

      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.uuid('file_id').references('id').inTable('media_files').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
