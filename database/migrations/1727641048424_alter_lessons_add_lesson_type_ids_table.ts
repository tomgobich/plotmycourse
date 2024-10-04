import OrganizationDto from '#dtos/organization'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('lesson_type_id')
        .unsigned()
        .references('lesson_types.id')
        .onDelete('CASCADE')
        .nullable() // make nullable temporarily, will switch to not null next after we've had an opportunity to populate pre-existing values
        .after('status_id')
    })

    this.defer(async (db) => {
      const organizationIds = await db
        .knexQuery()
        .table<OrganizationDto>('organizations')
        .pluck('id')

      const promises = organizationIds.map(async (organizationId) => {
        const defaultType = await db
          .from('lesson_types')
          .where('organization_id', organizationId)
          .where('is_default', true)
          .select('id')
          .firstOrFail()

        await db
          .from('lessons')
          .where('organization_id', organizationId)
          .update({ lesson_type_id: defaultType.id })
      })

      await Promise.all(promises)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('lesson_type_id')
    })
  }
}
