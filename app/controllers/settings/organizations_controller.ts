import GetOrganizationPendingUsers from '#actions/organizations/get_organization_pending_users'
import GetOrganizationUsers from '#actions/organizations/get_organization_users'
import SendOrganizationInvite from '#actions/organizations/send_organization_invite'
import OrganizationPendingUserDto from '#dtos/organization_pending_user'
import RoleDto from '#dtos/role'
import UserDto from '#dtos/user'
import Role from '#models/role'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import { organizationInviteValidator } from '#validators/organization'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrganizationsController {
  async index({ inertia, organization }: HttpContext) {
    const users = await GetOrganizationUsers.handle({ organization })
    const usersPending = await GetOrganizationPendingUsers.handle({ organization })
    const roles = await Role.query().orderBy('name')

    return inertia.render('settings/organization', {
      users: UserDto.fromArray(users),
      usersPending: OrganizationPendingUserDto.fromArray(usersPending),
      roles: RoleDto.fromArray(roles),
    })
  }

  async inviteUser({ request, response, organization, session, auth }: HttpContext) {
    const data = await request.validateUsing(
      organizationInviteValidator,
      withOrganizationMetaData(organization.id)
    )

    await SendOrganizationInvite.handle({
      organization,
      invitedByUserId: auth.user!.id,
      data,
    })

    session.flash('success', 'Invitation has been sent')

    return response.redirect().back()
  }

  async revokeUser({}: HttpContext) {}

  async updateUserRole({}: HttpContext) {}
}
