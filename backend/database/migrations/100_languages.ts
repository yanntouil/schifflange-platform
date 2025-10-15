import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'languages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 255).notNullable()
      table.string('code', 255).notNullable()
      table.string('locale', 255).notNullable()
      table.boolean('default').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
