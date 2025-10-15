import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seos_media_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('seo_id').references('id').inTable('seos').onDelete('CASCADE')
      table.uuid('file_id').references('id').inTable('media_files').onDelete('CASCADE')
      table.unique(['seo_id', 'file_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
