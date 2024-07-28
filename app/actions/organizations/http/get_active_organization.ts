import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import SetActiveOrganization from './set_active_organization.js'
import db from '@adonisjs/lucid/services/db'
import Organization from '#models/organization'

@inject()
export default class GetActiveOrganization {
  constructor(
    protected ctx: HttpContext,
    protected setActiveOrganization: SetActiveOrganization
  ) {}

  async handle() {
    const activeId = this.ctx.organizationId

    let organization = await this.#query()
      .if(activeId, (query) => query.where('organizations.id', activeId!))
      .first()

    if (!organization) {
      organization = await this.#query().firstOrFail()
    }

    if (!activeId || organization.id !== activeId) {
      this.setActiveOrganization.handle({ id: organization.id })
    }

    const roleId = await this.#getUserRole(organization)

    return { organization, roleId }
  }

  #query() {
    return this.ctx.auth
      .user!.related('organizations')
      .query()
      .preload('accessLevels')
      .preload('difficulties')
      .preload('statuses')
  }

  async #getUserRole(organization: Organization): Promise<number> {
    const { role_id } = await db
      .from('organization_users')
      .where('organization_id', organization.id)
      .where('user_id', this.ctx.auth.user!.id)
      .select('role_id')
      .firstOrFail()

    return role_id
  }
}
