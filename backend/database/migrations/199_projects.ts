import { projectDefaultState, projectStates } from '#models/project'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.enum('state', projectStates).defaultTo(projectDefaultState)

      table.uuid('category_id').references('id').inTable('project_categories').onDelete('SET NULL')
      table.uuid('tag_id').references('id').inTable('project_tags').onDelete('SET NULL')
      table.uuid('slug_id').references('id').inTable('slugs').onDelete('SET NULL')
      table.string('location', 255).defaultTo('')
      table.uuid('seo_id').references('id').inTable('seos').onDelete('SET NULL')
      table.uuid('content_id').references('id').inTable('contents').onDelete('SET NULL')
      table.uuid('publication_id').references('id').inTable('publications').onDelete('SET NULL')
      table.uuid('tracking_id').references('id').inTable('trackings').onDelete('SET NULL')
      table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE')

      table.uuid('created_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true })
      table.uuid('updated_by_id').references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
