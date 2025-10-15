import FileService from '#services/files/file'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspace_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')
      table.index(['workspace_id'])
      table.json('logo').defaultTo(FileService.emptyImage)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
