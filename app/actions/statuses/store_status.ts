import Organization from '#models/organization'
import { statusValidator } from '#validators/status'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  data: Infer<typeof statusValidator>
}

export default class StoreStatus {
  static async handle({ organization, data }: Params) {
    const order = await organization.findNextSort('statuses')

    return organization.related('statuses').create({
      ...data,
      order,
    })
  }
}
