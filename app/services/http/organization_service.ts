import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Organization from '#models/organization'

@inject()
export default class OrganizationService {
  cookieName = 'active_organization'

  constructor(protected ctx: HttpContext) {}

  get user() {
    return this.ctx.auth.user!
  }

  get organizationId() {
    return this.ctx.request.cookie(this.cookieName)
  }

  async all() {
    return this.user.related('organizations').query().orderBy('name')
  }

  async active() {
    const organization = await this.user
      .related('organizations')
      .query()
      .if(this.organizationId, (query) => query.where('organizations.id', this.organizationId))
      .firstOrFail()

    if (!this.organizationId) {
      this.ctx.response.cookie(this.cookieName, organization.id)
    }

    return organization
  }

  findActive(organizations: Organization[]) {
    return this.organizationId
      ? organizations.find((org) => org.id === Number.parseInt(this.organizationId))!
      : organizations.at(0)!
  }

  async setActive(id: number) {
    const organization = await this.user
      .related('organizations')
      .query()
      .where({ id })
      .firstOrFail()

    this.ctx.response.cookie(this.cookieName, organization.id)
  }

  async accessLevels(organization: Organization) {
    return organization.related('accessLevels').query().orderBy('order')
  }

  async difficulties(organization: Organization) {
    return organization.related('difficulties').query().orderBy('order')
  }

  async statuses(organization: Organization) {
    return organization.related('statuses').query().orderBy('order')
  }
}
