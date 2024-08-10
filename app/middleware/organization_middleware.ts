import GetAbilities, { Abilities } from '#actions/abilities/get_abilities'
import GetOrganizationUserRoleId from '#actions/organizations/get_organization_user_role_id'
import GetActiveOrganization from '#actions/organizations/http/get_active_organization'
import { activeCookieName } from '#config/organization'
import Organization from '#models/organization'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import OrganizationDto from '../dtos/organization.js'

@inject()
export default class OrganizationMiddleware {
  constructor(protected getActiveOrganization: GetActiveOrganization) {}

  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // get from cookie here, and set of CTX as source of truth so we can mutate it if needed
      ctx.organizationId = ctx.request.cookie(activeCookieName)

      const organization = await this.getActiveOrganization.handle()
      const roleId = await GetOrganizationUserRoleId.handle({
        organizationId: organization.id,
        userId: ctx.auth.user!.id,
      })

      ctx.organization = organization
      ctx.roleId = roleId
      ctx.can = GetAbilities.handle({ roleId })
    } catch (_) {
      // when user doesn't have an org, we need them to create one
      ctx.session.reflash()
      return ctx.response.redirect().toRoute('organizations.create')
    }

    if (ctx.request.method() !== 'GET') {
      return next()
    }

    const organizations = await ctx.auth.user!.getOrganizations().orderBy('name')

    ctx.inertia.share({
      organization: new OrganizationDto(ctx.organization),
      organizations: OrganizationDto.fromArray(organizations),
      can: ctx.can,
    })

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    organizationId?: number
    organization: Organization
    roleId: number
    can: Abilities
  }
}
