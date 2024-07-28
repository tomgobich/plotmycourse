import Organization from '#models/organization'

type Params = {
  organization: Organization
}

export default class GetOrganizationPendingInvites {
  static async handle({ organization }: Params) {
    return organization
      .related('invites')
      .query()
      .preload('invitedByUser')
      .whereNull('acceptedAt')
      .whereNull('canceledAt')
      .orderBy('createdAt', 'desc')
  }
}
