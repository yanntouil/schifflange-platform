import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'traces'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('session_id').defaultTo('')
      table.integer('session_duration').defaultTo(0)
      table.boolean('is_auth').defaultTo(false)
      table.boolean('is_bot').defaultTo(false)
      table.json('user_agent').defaultTo({})

      table.uuid('tracking_id').references('trackings.id').onDelete('CASCADE')
      table.uuid('workspace_id').references('workspaces.id').onDelete('CASCADE')
      table.index(['tracking_id', 'workspace_id'])

      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
