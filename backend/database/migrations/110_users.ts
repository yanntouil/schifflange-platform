import { userDefaultRole, userDefaultStatus, userRoles, userStatuses } from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      // email can not be unique: on registration, we allow multiple users with null email
      table.string('email', 254).nullable()
      table.string('password').notNullable()

      table.enum('status', userStatuses).defaultTo(userDefaultStatus)
      table.dateTime('deleted_at').nullable().defaultTo(null)
      table.enum('role', userRoles).defaultTo(userDefaultRole)

      table.uuid('language_id').references('languages.id').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
