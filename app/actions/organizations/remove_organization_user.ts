import Organization from '#models/organization'

type Params = {
  organization: Organization
  removeUserId: number
}

export default class RemoveOrganizationUser {
  static async handle({ organization, removeUserId }: Params) {
    await organization.related('users').detach([removeUserId])
  }
}
