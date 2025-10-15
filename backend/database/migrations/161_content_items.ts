import { contentItemDefaultState, contentItemStates } from '#models/content-item'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'content_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('content_id').references('id').inTable('contents').onDelete('CASCADE')
      table.enum('state', contentItemStates).defaultTo(contentItemDefaultState)
      table.integer('order').unsigned().defaultTo(0).notNullable()
      table.string('type', 255).defaultTo('')
      table.json('props').defaultTo('{}')
      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true })
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
