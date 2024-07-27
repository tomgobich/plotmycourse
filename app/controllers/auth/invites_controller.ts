import AcceptOrganizationInvite from '#actions/organizations/accept_organization_invite'
import OrganizationPendingUser from '#models/organization_pending_user'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class InvitesController {
  async accept({ request, response, auth, params, session }: HttpContext) {
    if (!request.hasValidSignature()) {
      session.flash('errorBag', 'An invalid invitation URL was provided')
      return response.redirect().toRoute('login.show')
    }

    await auth.use('web').check()

    if (!auth.user) {
      const invite = await OrganizationPendingUser.findOrFail(params.id)
      const isUser = await User.query().whereILike('email', invite.email).first()

      session.put('invite_id', params.id)

      return isUser
        ? response.redirect().toRoute('login.show')
        : response.redirect().toRoute('register.show')
    }

    const result = await AcceptOrganizationInvite.handle({
      inviteId: params.id,
      user: auth.user!,
    })

    session.flash('success', result.message)

    return response.redirect().toRoute('courses.index')
  }
}
