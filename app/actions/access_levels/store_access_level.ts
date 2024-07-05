import Organization from '#models/organization'
import { accessLevelValidator } from '#validators/access_level'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  data: Infer<typeof accessLevelValidator>
}

export default class StoreAccessLevel {
  static async handle({ organization, data }: Params) {
    const order = await organization.findNextSort('accessLevels')

    return organization.related('accessLevels').create({
      ...data,
      order,
    })
  }
}
