import GetOrganizationAbilities from '#actions/abilities/get_organization_abilities'
import DestroyOrganization from '#actions/organizations/destroy_organization'
import GetOrganizationUserRoleId from '#actions/organizations/get_organization_user_role_id'
import GetActiveOrganization from '#actions/organizations/http/get_active_organization'
import SetActiveOrganization from '#actions/organizations/http/set_active_organization'
import StoreOrganization from '#actions/organizations/store_organization'
import UpdateOrganization from '#actions/organizations/update_organization'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import { organizationValidator } from '#validators/organization'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class OrganizationsController {
  constructor(
    protected getActiveOrganization: GetActiveOrganization,
    protected setActiveOrganization: SetActiveOrganization
  ) {}

  async create({ inertia }: HttpContext) {
    return inertia.render('organizations/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(organizationValidator)
    const organization = await StoreOrganization.handle({
      user: auth.user!,
      data,
    })

    this.setActiveOrganization.handle({ id: organization.id })

    return response.redirect().toRoute('courses.index')
  }

  async active({ response, params }: HttpContext) {
    this.setActiveOrganization.handle({ id: params.id })

    return response.redirect().toRoute('courses.index')
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, auth }: HttpContext) {
    const roleId = await GetOrganizationUserRoleId.handle({
      organizationId: params.id,
      userId: auth.user!.id,
    })

    if (!GetOrganizationAbilities.canEdit(roleId)) {
      throw new UnauthorizedException('You are not authorized to edit this organization')
    }

    const data = await request.validateUsing(organizationValidator)

    await UpdateOrganization.handle({
      user: auth.user!,
      id: params.id,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    const roleId = await GetOrganizationUserRoleId.handle({
      organizationId: ctx.params.id,
      userId: ctx.auth.user!.id,
    })

    if (!GetOrganizationAbilities.canDestroy(roleId)) {
      throw new UnauthorizedException('You are not authorized to delete this organization')
    }

    const destroyed = await DestroyOrganization.handle({
      user: ctx.auth.user!,
      id: ctx.params.id,
    })

    if (destroyed.id === ctx.organizationId) {
      ctx.organizationId = undefined

      // will fetch a default and set it as active
      await this.getActiveOrganization.handle()
    }

    return ctx.response.redirect().toRoute('courses.index')
  }
}
