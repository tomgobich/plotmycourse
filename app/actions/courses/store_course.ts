import Organization from '#models/organization'
import { courseValidator } from '#validators/course'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  data: Infer<typeof courseValidator>
}

export default class StoreCourse {
  static async handle({ organization, data }: Params) {
    return organization.related('courses').create({
      ...data,
      order: await organization.findNextSort(),
    })
  }
}
