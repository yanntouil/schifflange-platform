import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('(UUID())'))
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
