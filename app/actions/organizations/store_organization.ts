import Roles from '#enums/roles'
import Organization from '#models/organization'
import User from '#models/user'
import { organizationValidator } from '#validators/organization'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = {
  user: User
  data: Infer<typeof organizationValidator>
}

export default class StoreOrganization {
  static async handle({ user, data }: Params) {
    return db.transaction(async (trx) => {
      const organization = await Organization.create(data, { client: trx })

      await organization.related('users').attach({
        [user.id]: {
          role_id: Roles.OrganizationAdmin,
        },
      })

      return organization
    })
  }
}
