import Organization from '#models/organization'
import { difficultyValidator } from '#validators/difficulty'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof difficultyValidator>
}

export default class UpdateDifficulty {
  static async handle({ organization, id, data }: Params) {
    const difficulty = await organization
      .related('difficulties')
      .query()
      .where({ id })
      .firstOrFail()

    const org = await difficulty.related('organization').query().firstOrFail()

    console.log({ org: org.serialize(), difficulty })

    await difficulty.merge(data).save()

    return difficulty
  }
}
