import FileService from '#services/files/file'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspace_themes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('name', 255).notNullable()
      table.text('description', 'longtext').notNullable()
      table.boolean('is_default').defaultTo(false)
      table.json('image').defaultTo(FileService.emptyImage)
      table.json('config').defaultTo({})
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
