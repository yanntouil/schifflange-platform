import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registration_attempts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.string('email').notNullable()
      table.string('ip_address', 45).nullable()
      table.string('user_agent').nullable()
      table.boolean('success').defaultTo(false)
      table.boolean('notification_sent').defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
