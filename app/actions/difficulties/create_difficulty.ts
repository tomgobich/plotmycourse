import Organization from '#models/organization'
import { difficultyValidator } from '#validators/difficulty'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  data: Infer<typeof difficultyValidator>
}

export default class CreateDifficulty {
  static async handle({ organization, data }: Params) {
    const order = await organization.findNextSort('difficulties')

    return organization.related('difficulties').create({
      ...data,
      order,
    })
  }
}
