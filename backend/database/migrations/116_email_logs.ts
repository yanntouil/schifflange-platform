import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'email_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.string('email').notNullable()
      table.string('template').notNullable()
      table.string('subject').notNullable()
      table.enum('status', ['queued', 'sent', 'failed']).defaultTo('sent').notNullable()
      table.json('metadata').notNullable().defaultTo('{}')
      table.integer('retry_attempts').defaultTo(0).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
