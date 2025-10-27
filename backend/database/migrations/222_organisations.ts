import { organisationDefaultType, organisationTypes } from '#models/organisation'
import FileService from '#services/files/file'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organisations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.enum('type', organisationTypes).defaultTo(organisationDefaultType)
      table.boolean('pin').defaultTo(false)
      table.integer('pin_order').defaultTo(0)

      table
        .uuid('parent_organisation_id')
        .nullable()
        .references('id')
        .inTable('organisations')
        .onDelete('SET NULL')
      table.json('logo_image').defaultTo(FileService.emptyImage)
      table.json('card_image').defaultTo(FileService.emptyImage)
      table.json('phones').defaultTo('[]')
      table.json('emails').defaultTo('[]')
      table.json('extras').defaultTo('[]')
      table.json('addresses').defaultTo('[]')
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
