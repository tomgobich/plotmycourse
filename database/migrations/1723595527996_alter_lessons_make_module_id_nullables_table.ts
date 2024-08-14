import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('module_id').alter().nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
