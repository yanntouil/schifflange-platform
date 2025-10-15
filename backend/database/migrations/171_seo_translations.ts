import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seo_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.uuid('seo_id').references('id').inTable('seos').onDelete('CASCADE')
      table.string('title', 255).defaultTo('')
      table.text('description').defaultTo('')
      table.json('keywords').defaultTo('[]')
      table.json('socials').defaultTo('[]')
      table.uuid('image_id').nullable().references('id').inTable('media_files').onDelete('SET NULL')
      table.unique(['seo_id', 'language_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
