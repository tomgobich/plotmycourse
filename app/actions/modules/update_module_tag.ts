import Organization from '#models/organization'
import { modulePatchTagValidator } from '#validators/module'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof modulePatchTagValidator>
}

export default class UpdateModuleTag {
  static async handle({ organization, id, data }: Params) {
    const module = await organization.findModule(id)

    await module.merge(data).save()

    return module
  }
}
