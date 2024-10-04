import { defaults } from '#config/organization'
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

      const userPromise = this.#assignAdmin(organization, user)
      const defaultPromises = this.#createDefaults(organization)

      await Promise.all([userPromise, ...defaultPromises])

      return organization
    })
  }

  static async #assignAdmin(organization: Organization, user: User) {
    return organization.related('users').attach({
      [user.id]: {
        role_id: Roles.OrganizationAdmin,
      },
    })
  }

  static #createDefaults(organization: Organization) {
    return [
      organization.related('difficulties').createMany(defaults.difficulties),
      organization.related('statuses').createMany(defaults.statuses),
      organization.related('accessLevels').createMany(defaults.accessLevels),
      organization.related('lessonTypes').createMany(defaults.lessonTypes),
    ]
  }
}
