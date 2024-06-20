import Organization from '#models/organization'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import OrganizationDto from '../dtos/organization.js'
import GetActiveForUser from '#actions/organizations/get_active_for_user'
import { activeCookieName } from '#config/organization'
import GetAllForUser from '#actions/organizations/get_all_for_user'

@inject()
export default class OrganizationMiddleware {
  constructor(
    protected getActiveForUser: GetActiveForUser,
    protected getAllForUser: GetAllForUser
  ) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const activeId = ctx.request.cookie(activeCookieName)
    const organization = await this.getActiveForUser.handle(ctx.auth.user!, activeId)

    ctx.organization = organization

    if (!activeId) {
      ctx.response.cookie(activeCookieName, organization.id)
    }

    if (ctx.request.method() !== 'GET') {
      return next()
    }

    const organizations = await this.getAllForUser.handle(ctx.auth.user!)

    ctx.inertia.share({
      organization: new OrganizationDto(organization),
      organizations: OrganizationDto.fromArray(organizations),
    })

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    organization: Organization
  }
}
