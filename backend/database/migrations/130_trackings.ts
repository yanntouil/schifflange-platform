import { trackingType, trackingTypeDefault } from '#models/tracking'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trackings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('UUID()'))
      table.enum('type', trackingType).defaultTo(trackingTypeDefault)
      table.string('model').notNullable().defaultTo('unknown')
      table.uuid('workspace_id').references('workspaces.id').onDelete('CASCADE')
      table.index(['workspace_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
