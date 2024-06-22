import Organization from '#models/organization'

type Params = {
  organization: Organization
  id: number
}

export default class DestroyDifficulty {
  static async handle({ organization, id }: Params) {
    const difficulty = await organization
      .related('difficulties')
      .query()
      .where({ id })
      .firstOrFail()

    await difficulty.delete()
  }
}
