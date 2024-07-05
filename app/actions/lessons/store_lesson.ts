import Organization from '#models/organization'
import { lessonValidator } from '#validators/lesson'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  moduleId: number
  data: Infer<typeof lessonValidator>
}

export default class StoreLesson {
  static async handle({ organization, moduleId, data }: Params) {
    const module = await organization.findModule(moduleId)

    return module.related('lessons').create({
      ...data,
      organizationId: organization.id,
      order: await module.findNextSort(),
    })
  }
}
