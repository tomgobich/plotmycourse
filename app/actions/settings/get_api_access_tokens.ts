import Organization from '#models/organization'

type Params = {
  organization: Organization
}

export default class GetApiAccessTokens {
  static async handle({ organization }: Params) {
    const all = await Organization.accessTokens.all(organization)
    return all.filter((token) => !token.isExpired())
  }
}
