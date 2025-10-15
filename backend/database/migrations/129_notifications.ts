import {
  notificationDefaultPriority,
  notificationDefaultStatus,
  notificationPriorities,
  notificationStatuses,
} from '#models/notification'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.uuid('user_id').notNullable().index()
      table.uuid('workspace_id').nullable().index()

      table.string('type').notNullable()
      table.string('related_type').notNullable()
      table.string('related_id').notNullable()

      table.json('metadata').notNullable()

      table.enum('status', notificationStatuses).notNullable().defaultTo(notificationDefaultStatus)
      table
        .enum('priority', notificationPriorities)
        .notNullable()
        .defaultTo(notificationDefaultPriority)

      table.timestamp('delivered_at', { useTz: true }).nullable()
      table.timestamp('expires_at', { useTz: true }).nullable()

      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
