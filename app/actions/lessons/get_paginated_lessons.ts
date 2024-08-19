import Organization from '#models/organization'

type Params = {
  organization: Organization
  page?: number
  perPage?: number
}

export default class GetPaginatedLessons {
  static async handle({ organization, page = 1, perPage = 25 }: Params) {
    return organization
      .related('lessons')
      .query()
      .preload('status')
      .preload('accessLevel')
      .preload('module', (query) => query.preload('course'))
      .orderBy('updatedAt', 'desc')
      .paginate(page, perPage)
  }
}
