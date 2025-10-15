import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspace_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.string('event').notNullable()
      table.string('ip_address', 45).nullable()
      table.json('metadata').notNullable().defaultTo('{}')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
