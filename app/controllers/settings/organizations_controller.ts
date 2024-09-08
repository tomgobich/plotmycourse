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
import {
  organizationAccessTokenValidator,
  organizationInviteValidator,
} from '#validators/organization'
import type { HttpContext } from '@adonisjs/core/http'
import StoreApiAccessToken from '#actions/settings/store_api_access_token'
import GetApiAccessTokens from '#actions/settings/get_api_access_tokens'
import AccessTokenDto from '#dtos/access_token'

export default class OrganizationsController {
  async index({ inertia, organization, can }: HttpContext) {
    if (!can.organization.edit) {
      throw new UnauthorizedException('You are not authorized to edit this organization')
    }

    const users = await GetOrganizationUsers.handle({ organization })
    const pendingInvites = await GetOrganizationPendingInvites.handle({ organization })
    const roles = await Role.query().orderBy('name')
    const accessTokens = await GetApiAccessTokens.handle({ organization })

    return inertia.render('settings/organization', {
      users: UserDto.fromArray(users),
      invites: OrganizationInviteDto.fromArray(pendingInvites),
      roles: RoleDto.fromArray(roles),
      accessTokens: AccessTokenDto.fromArray(accessTokens),
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

  async storeAccessToken({ request, response, organization, session, can }: HttpContext) {
    if (!can.organization.manageAccessTokens) {
      throw new UnauthorizedException(
        'You are not authorized to create access tokens for this organization'
      )
    }

    const data = await request.validateUsing(organizationAccessTokenValidator)
    const token = await StoreApiAccessToken.handle({ organization, data })

    session.flash('success', 'Your access token has been created')

    return response.json({
      accessToken: new AccessTokenDto(token),
    })
  }
}
