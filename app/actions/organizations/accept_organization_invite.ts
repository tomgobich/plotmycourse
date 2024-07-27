import OrganizationPendingUser from '#models/organization_pending_user'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type Params = {
  inviteId: number
  user: User
}

export default class AcceptOrganizationInvite {
  static async handle({ inviteId, user }: Params) {
    const invite = await OrganizationPendingUser.query()
      .preload('organization')
      .where('id', inviteId)
      .firstOrFail()

    if (invite.email !== user.email) {
      throw new Exception('Your email does not match the invitation', {
        code: 'E_INVITE_MISMATCH',
        status: 401,
      })
    }

    if (invite.acceptedAt) {
      throw new Exception('This invitation has already been accepted', {
        code: 'E_INVITE_INVALID',
        status: 401,
      })
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
