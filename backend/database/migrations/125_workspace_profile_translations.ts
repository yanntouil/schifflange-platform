import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspace_profile_translations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('profile_id').references('id').inTable('workspace_profiles').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.unique(['profile_id', 'language_id'])
      table.index(['profile_id', 'language_id'])

      table.text('welcome_message', 'longtext').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
