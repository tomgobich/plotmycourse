import Module from '#models/module'
import Organization from '#models/organization'
import { lessonValidator } from '#validators/lesson'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  data: Infer<typeof lessonValidator>
}

export default class StoreLesson {
  static async handle({ organization, data }: Params) {
    let order = data.moduleId
      ? await Module.findNextSort(data.moduleId)
      : await organization.findNextSort('lessons')

    return organization.related('lessons').create({
      ...data,
      organizationId: organization.id,
      order,
    })
  }
}
