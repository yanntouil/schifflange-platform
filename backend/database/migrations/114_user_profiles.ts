import { makeAddress } from '#models/user-profile'
import FileService from '#services/files/file'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))

      table.string('firstname', 255).defaultTo('')
      table.string('lastname', 255).defaultTo('')
      table.json('image').defaultTo(FileService.emptyImage)
      table.date('dob').nullable().defaultTo(null)

      table.string('position', 255).defaultTo('')
      table.string('company', 255).defaultTo('')

      table.json('phones').defaultTo([])
      table.json('emails').defaultTo([])
      table.json('address').defaultTo(makeAddress())
      table.json('extras').defaultTo([])

      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
