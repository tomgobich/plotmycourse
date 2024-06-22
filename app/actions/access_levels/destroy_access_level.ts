import Organization from '#models/organization'

type Params = {
  organization: Organization
  id: number
}

export default class DestroyAccessLevel {
  static async handle({ organization, id }: Params) {
    const accessLevel = await organization
      .related('accessLevels')
      .query()
      .where({ id })
      .firstOrFail()

    await accessLevel.delete()

    return accessLevel
  }
}
