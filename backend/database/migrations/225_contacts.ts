import { BaseSchema } from '@adonisjs/lucid/schema'
import FileService from '#services/files/file'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('first_name', 255).defaultTo('')
      table.string('last_name', 255).defaultTo('')
      table.string('political_party', 255).defaultTo('')
      table.json('portrait_image').defaultTo(FileService.emptyImage)
      table.json('square_image').defaultTo(FileService.emptyImage)
      table.json('phones').defaultTo('[]')
      table.json('emails').defaultTo('[]')
      table.json('extras').defaultTo('[]')
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
