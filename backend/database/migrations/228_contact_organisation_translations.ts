import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_organisation_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.string('role', 255).defaultTo('')
      table.text('role_description').defaultTo('')
      table
        .uuid('contact_organisation_id')
        .references('id')
        .inTable('contact_organisations')
        .onDelete('CASCADE')
        .withKeyName('contact_org_trans_org_id_fk')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.unique(['contact_organisation_id', 'language_id'], { indexName: 'contact_org_trans_org_lang_unique' })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
