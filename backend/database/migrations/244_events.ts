import { eventDefaultState, eventStates } from '#models/event'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('(UUID())'))
      table.enum('state', eventStates).notNullable().defaultTo(eventDefaultState)
      table.json('props').notNullable().defaultTo({})

      table.uuid('slug_id').references('id').inTable('slugs').onDelete('SET NULL').nullable()
      table.uuid('seo_id').references('id').inTable('seos').onDelete('SET NULL').nullable()
      table.uuid('content_id').references('id').inTable('contents').onDelete('SET NULL').nullable()
      table
        .uuid('schedule_id')
        .references('id')
        .inTable('schedules')
        .onDelete('SET NULL')
        .nullable()
      table
        .uuid('publication_id')
        .references('id')
        .inTable('publications')
        .onDelete('SET NULL')
        .nullable()
      table
        .uuid('tracking_id')
        .references('id')
        .inTable('trackings')
        .onDelete('SET NULL')
        .nullable()
      table
        .uuid('workspace_id')
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')
        .notNullable()
      table.index(['workspace_id'])

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL').nullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
