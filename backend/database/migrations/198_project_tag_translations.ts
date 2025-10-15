import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_tag_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('name', 255).defaultTo('')
      table.uuid('tag_id').references('id').inTable('project_tags').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.unique(['tag_id', 'language_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
