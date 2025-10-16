import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organisations_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('organisation_id').references('id').inTable('organisations').onDelete('CASCADE')
      table.uuid('category_id').references('id').inTable('organisation_categories').onDelete('CASCADE')
      table.primary(['organisation_id', 'category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
