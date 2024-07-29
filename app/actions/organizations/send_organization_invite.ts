import Organization from '#models/organization'
import env from '#start/env'
import { organizationInviteValidator } from '#validators/organization'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  invitedByUserId: number
  data: Infer<typeof organizationInviteValidator>
}

export default class SendOrganizationInvite {
  static async handle({ organization, invitedByUserId, data }: Params) {
    const invite = await organization.related('invites').create({
      invitedByUserId,
      ...data,
    })

    const inviteUrl = router
      .builder()
      .params({ id: invite.id })
      .prefixUrl(env.get('APP_URL'))
      .makeSigned('invites.organization.accept')

    await mail.sendLater((message) => {
      message
        .to(data.email)
        .subject(`Your have been invited to join ${organization.name}`)
        .htmlView('emails/organization_invite', { organization, inviteUrl })
    })
  }
}
