import { BaseSchema } from '@adonisjs/lucid/schema'
import { organisationDefaultType, organisationTypes } from '#models/organisation'
import FileService from '#services/files/file'

export default class extends BaseSchema {
  protected tableName = 'organisation_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table
        .enum('type', organisationTypes)
        .defaultTo(organisationDefaultType)
      table.integer('order').unsigned().defaultTo(0)
      table.json('image').defaultTo(FileService.emptyImage)
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
