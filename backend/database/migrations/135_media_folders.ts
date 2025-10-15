import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media_folders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('name', 255).defaultTo('')
      table.boolean('lock').defaultTo(false)

      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')
      table
        .uuid('parent_id')
        .nullable()
        .references('id')
        .inTable('media_folders')
        .onDelete('CASCADE')

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true })
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
