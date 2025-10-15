import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_item_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('menu_item_id').references('id').inTable('menu_items').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')

      table.string('name').notNullable().defaultTo('')
      table.string('description').notNullable().defaultTo('')
      table.json('props').defaultTo('{}')

      table.unique(['menu_item_id', 'language_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
