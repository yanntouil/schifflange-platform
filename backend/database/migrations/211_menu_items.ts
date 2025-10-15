import { menuItemDefaultState, menuItemStates } from '#models/menu-item'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('menu_id').references('id').inTable('menus').onDelete('CASCADE')
      table.uuid('parent_id').nullable().references('id').inTable('menu_items').onDelete('CASCADE')

      table.integer('order').notNullable().defaultTo(0)
      table.enum('state', menuItemStates).notNullable().defaultTo(menuItemDefaultState)
      table.uuid('slug_id').nullable().references('id').inTable('slugs').onDelete('SET NULL')

      table.string('type').notNullable().defaultTo('')
      table.json('props').notNullable().defaultTo('{}')

      table
        .uuid('workspace_id')
        .nullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')

      table.uuid('created_by_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.dateTime('created_at').notNullable().defaultTo(this.now())

      table.uuid('updated_by_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.dateTime('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
