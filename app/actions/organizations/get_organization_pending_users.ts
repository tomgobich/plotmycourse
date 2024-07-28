import Organization from '#models/organization'

type Params = {
  organization: Organization
}

export default class GetOrganizationPendingUsers {
  static async handle({ organization }: Params) {
    return organization
      .related('usersPending')
      .query()
      .preload('invitedByUser')
      .whereNull('acceptedAt')
      .orderBy('createdAt', 'desc')
  }
}
