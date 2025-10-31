import { recurringFrequencies, recurringFrequencyDefault } from '#models/schedule-rule'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedule_rules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('(UUID())'))

      table
        .uuid('schedule_id')
        .notNullable()
        .references('id')
        .inTable('schedules')
        .onDelete('CASCADE')
      table.index(['schedule_id'])

      // Schedule time
      table.boolean('all_day').notNullable().defaultTo(false)
      table.date('start_date').nullable()
      table.date('end_date').nullable()
      table.timestamp('start_date_time').nullable()
      table.timestamp('end_date_time').nullable()

      // Recurrence
      table.boolean('is_recurring').notNullable().defaultTo(false)
      table.enum('freq', recurringFrequencies).notNullable().defaultTo(recurringFrequencyDefault)
      table.integer('interval').nullable()
      table.json('by_weekday').notNullable().defaultTo([])
      table.timestamp('until').nullable()
      table.json('excluded_dates').notNullable().defaultTo([])

      table.index(['all_day', 'start_date_time', 'end_date_time'])
      table.index(['all_day', 'start_date_time', 'until'])
      table.index(['all_day', 'start_date', 'end_date'])
      table.index(['all_day', 'start_date', 'until'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
