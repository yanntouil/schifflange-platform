import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'councils_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('councils_id').references('id').inTable('councils').onDelete('CASCADE')
      table.uuid('file_id').references('id').inTable('media_files').onDelete('CASCADE')

      table.primary(['councils_id', 'file_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
