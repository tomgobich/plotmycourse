import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Roles from '#enums/roles'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      {
        id: Roles.OrganizationMember,
        name: 'organization_member',
      },
      {
        id: Roles.OrganizationAdmin,
        name: 'organization_admin',
      },
    ])
  }
}
