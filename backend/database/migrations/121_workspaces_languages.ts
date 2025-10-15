import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspaces_languages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.unique(['workspace_id', 'language_id'])
      table.index(['workspace_id', 'language_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
