import UnauthorizedException from '#exceptions/unauthorized_exception'
import OrganizationInvite from '#models/organization_invite'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type Params = {
  inviteId: number
  user: User
}

export default class AcceptOrganizationInvite {
  static async handle({ inviteId, user }: Params) {
    const invite = await OrganizationInvite.query()
      .preload('organization')
      .where('id', inviteId)
      .firstOrFail()

    if (invite.email !== user.email) {
      throw new UnauthorizedException('Your email does not match the invitation')
    }

    if (invite.acceptedAt) {
      throw new UnauthorizedException('This invitation has already been accepted')
    }

    await db.transaction(async (trx) => {
      await invite.organization.related('users').attach(
        {
          [user.id]: {
            role_id: invite.roleId,
          },
        },
        trx
      )

      await invite.useTransaction(trx).merge({ acceptedAt: DateTime.now() }).save()
    })

    return {
      message: `You've been successfully added to ${invite.organization.name}`,
      invite,
    }
  }
}
