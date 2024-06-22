import Organization from '#models/organization'

type Params = {
  organization: Organization
  id: number
}

export default class DestroyStatus {
  static async handle({ organization, id }: Params) {
    const status = await organization.related('statuses').query().where({ id }).firstOrFail()

    await status.delete()

    return status
  }
}
