import Organization from '#models/organization'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import OrganizationDto from '../dtos/organization.js'
import GetActiveOrganization from '#actions/organizations/http/get_active_organization'
import { inject } from '@adonisjs/core'
import { activeCookieName } from '#config/organization'

@inject()
export default class OrganizationMiddleware {
  constructor(protected getActiveOrganization: GetActiveOrganization) {}

  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // get from cookie here, and set of CTX as source of truth so we can mutate it if needed
      ctx.organizationId = ctx.request.cookie(activeCookieName)
      ctx.organization = await this.getActiveOrganization.handle()
    } catch (_) {
      // when user doesn't have an org, we need them to create one
      return ctx.response.redirect().toRoute('organizations.create')
    }

    if (ctx.request.method() !== 'GET') {
      return next()
    }

    const organizations = await ctx.auth.user!.getOrganizations().orderBy('name')

    ctx.inertia.share({
      organization: new OrganizationDto(ctx.organization),
      organizations: OrganizationDto.fromArray(organizations),
    })

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    organizationId?: number
    organization: Organization
  }
}
