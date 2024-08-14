import Organization from '#models/organization'
import { lessonValidator } from '#validators/lesson'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  moduleId?: number
  data: Infer<typeof lessonValidator>
}

export default class StoreLesson {
  static async handle(params: Params) {
    return params.moduleId ? this.#createForModule(params) : this.#createStandalone(params)
  }

  static async #createForModule({ organization, moduleId, data }: Params) {
    const module = await organization.findModule(moduleId!)

    return module.related('lessons').create({
      ...data,
      organizationId: organization.id,
      order: await module.findNextSort(),
    })
  }

  static async #createStandalone({ organization, data }: Params) {
    return organization.related('lessons').create({
      ...data,
      order: await organization.findNextSort('lessons'),
    })
  }
}
