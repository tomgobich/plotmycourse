import CancelOrganizationInvite from '#actions/organizations/cancel_organization_invite'
import GetOrganizationPendingInvites from '#actions/organizations/get_organization_pending_invites'
import GetOrganizationUsers from '#actions/organizations/get_organization_users'
import RemoveOrganizationUser from '#actions/organizations/remove_organization_user'
import SendOrganizationInvite from '#actions/organizations/send_organization_invite'
import OrganizationInviteDto from '#dtos/organization_invite'
import RoleDto from '#dtos/role'
import UserDto from '#dtos/user'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import Role from '#models/role'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import { organizationInviteValidator } from '#validators/organization'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrganizationsController {
  async index({ inertia, organization, can }: HttpContext) {
    if (!can.organization.edit) {
      throw new UnauthorizedException('You are not authorized to edit this organization')
    }

    const users = await GetOrganizationUsers.handle({ organization })
    const pendingInvites = await GetOrganizationPendingInvites.handle({ organization })
    const roles = await Role.query().orderBy('name')

    return inertia.render('settings/organization', {
      users: UserDto.fromArray(users),
      invites: OrganizationInviteDto.fromArray(pendingInvites),
      roles: RoleDto.fromArray(roles),
    })
  }

  async inviteUser({ request, response, organization, session, auth, can }: HttpContext) {
    if (!can.organization.manageUsers) {
      throw new UnauthorizedException('You are not authorized to invite users')
    }

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

  async cancelInvite({ response, organization, params, session, auth, can }: HttpContext) {
    if (!can.organization.manageUsers) {
      throw new UnauthorizedException('You are not authorized to cancel invitations')
    }

    await CancelOrganizationInvite.handle({
      organization,
      canceledByUserId: await auth.user!.id,
      inviteId: params.id,
    })

    session.flash('success', 'The invitation has been canceled')

    return response.redirect().back()
  }

  async removeUser({ response, organization, params, session, can }: HttpContext) {
    if (!can.organization.manageUsers) {
      throw new UnauthorizedException('You are not authorized to remove users')
    }

    await RemoveOrganizationUser.handle({ organization, removeUserId: params.id })

    session.flash('success', 'Member has been successfully removed')

    return response.redirect().back()
  }

  async updateUserRole({}: HttpContext) {}
}
