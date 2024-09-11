import Organization from '#models/organization'

type Params = {
  organization: Organization
  id: number
}

export default class DestroyApiAccessToken {
  static async handle({ organization, id }: Params) {
    await Organization.accessTokens.delete(organization, id)
  }
}
