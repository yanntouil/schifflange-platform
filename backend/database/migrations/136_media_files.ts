import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('original_name', 255).defaultTo('')
      table.integer('size').unsigned().defaultTo(0)
      table.string('extension', 20).defaultTo('')
      table.string('path', 255).defaultTo('')
      table.string('client_name', 255).defaultTo('')
      table.json('exif').defaultTo({})

      table.string('copyright', 255).defaultTo('')
      table.string('copyright_link', 255).defaultTo('')

      table.string('url', 255).defaultTo('')
      table.string('thumbnail_url', 255).defaultTo('')
      table.string('thumbnail_path', 255).defaultTo('')
      table.string('preview_url', 255).defaultTo('')
      table.string('preview_path', 255).defaultTo('')
      table.string('original_url', 255).defaultTo('')
      table.string('original_path', 255).defaultTo('')
      table.integer('width').unsigned().defaultTo(0)
      table.integer('height').unsigned().defaultTo(0)

      table.json('transform').defaultTo({})

      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')
      table
        .uuid('folder_id')
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
