import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_organisations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('contact_id').references('id').inTable('contacts').onDelete('CASCADE')
      table.uuid('organisation_id').references('id').inTable('organisations').onDelete('CASCADE')
      table.json('phones').defaultTo('[]')
      table.json('emails').defaultTo('[]')
      table.json('extras').defaultTo('[]')
      table.boolean('is_primary').defaultTo(false)
      table.boolean('is_responsible').defaultTo(false)
      table.integer('order').unsigned().defaultTo(0)
      table.timestamp('start_date').nullable()
      table.timestamp('end_date').nullable()

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
