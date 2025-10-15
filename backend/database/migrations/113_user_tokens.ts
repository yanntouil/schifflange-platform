import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('tokenable_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('value').notNullable()
      table.string('hash').notNullable().unique()
      table.string('protected_value').nullable()

      table.timestamp('expires_at').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
