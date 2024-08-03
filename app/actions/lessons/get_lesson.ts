import Organization from '#models/organization'

type Params = {
  organization: Organization
  id: number
}

export default class GetLesson {
  static async handle({ organization, id }: Params) {
    return organization
      .related('lessons')
      .query()
      .where({ id })
      .preload('module', (query) => query.preload('course'))
      .preload('status')
      .preload('accessLevel')
      .firstOrFail()
  }
}
