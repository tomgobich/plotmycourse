import { defaults } from '#config/organization'
import OrganizationDto from '#dtos/organization'
import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'lesson_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('organization_id')
        .unsigned()
        .references('organizations.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name', 50).notNullable()
      table.string('color', 10).notNullable()
      table.integer('order').unsigned().notNullable().defaultTo(0)
      table.boolean('is_default').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.defer(async (db) => {
      const organizationIds = await db
        .knexQuery()
        .table<OrganizationDto>('organizations')
        .pluck('id')

      const promises = organizationIds.map((organizationId) => {
        return db.table(this.tableName).multiInsert(
          defaults.lessonTypes.map((type) => ({
            organization_id: organizationId,
            name: type.name,
            color: type.color,
            is_default: type.isDefault,
            order: type.order,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL(),
          }))
        )
      })

      await Promise.all(promises)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
