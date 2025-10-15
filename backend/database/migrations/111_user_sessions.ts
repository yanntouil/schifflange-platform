import { makeUserAgent } from '#utils/device-parser'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_sessions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.string('ip_address', 45).nullable()
      table.json('device_info').notNullable().defaultTo(makeUserAgent({}))
      table.string('token', 255).notNullable().unique()
      table
        .timestamp('last_activity', { useTz: true })
        .notNullable()
        .defaultTo(this.db.rawQuery('CURRENT_TIMESTAMP').knexQuery)
      table.boolean('is_active').defaultTo(true)

      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(this.db.rawQuery('CURRENT_TIMESTAMP').knexQuery)
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .defaultTo(this.db.rawQuery('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP').knexQuery)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
