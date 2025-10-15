import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'template_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('language_id').notNullable().references('id').inTable('languages').onDelete('CASCADE')
      table.uuid('template_id').notNullable().references('id').inTable('templates').onDelete('CASCADE')
      table.string('title', 255).notNullable().defaultTo('')
      table.text('description').notNullable().defaultTo('')
      table.json('tags').notNullable().defaultTo('[]')
      table.unique(['template_id', 'language_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
