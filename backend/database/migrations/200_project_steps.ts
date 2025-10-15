import {
  projectStepDefaultState,
  projectStepDefaultType,
  projectStepStates,
  projectStepTypes,
} from '#models/project-step'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'project_steps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.enum('type', projectStepTypes).notNullable().defaultTo(projectStepDefaultType)

      table.uuid('seo_id').notNullable().references('id').inTable('seos').onDelete('CASCADE')
      table
        .uuid('project_id')
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table
        .uuid('content_id')
        .notNullable()
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
      table
        .uuid('tracking_id')
        .notNullable()
        .references('id')
        .inTable('trackings')
        .onDelete('CASCADE')
      table.uuid('slug_id').notNullable().references('id').inTable('slugs').onDelete('CASCADE')

      table.enum('state', projectStepStates).notNullable().defaultTo(projectStepDefaultState)

      table
        .uuid('workspace_id')
        .nullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('SET NULL')
      table.uuid('created_by_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.uuid('updated_by_id').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['workspace_id'])
      table.index(['project_id'])
      table.index(['state'])
      table.index(['type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
