import Organization from '#models/organization'
import { Infer } from '@vinejs/vine/types'
import { organizationAccessTokenValidator } from '#validators/organization'

type Params = {
  organization: Organization
  data: Infer<typeof organizationAccessTokenValidator>
}

export default class StoreApiAccessToken {
  static async handle({ organization, data }: Params) {
    return Organization.accessTokens.create(organization, data.permissions, {
      name: data.name,
    })
  }
}
