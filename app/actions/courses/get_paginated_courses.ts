import NumbersFilter from '#actions/filters/numbers_filter'
import StringFilter from '#actions/filters/string_filter'
import Course from '#models/course'
import Organization from '#models/organization'
import { coursesFilterValidator } from '#validators/course'
import { HasManyQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import { Infer } from '@vinejs/vine/types'
import string from '@adonisjs/core/helpers/string'

type Filters = Infer<typeof coursesFilterValidator>
type Query = HasManyQueryBuilderContract<typeof Course, Course>

type Params = {
  organization: Organization
  filters?: Filters
  page?: number
  perPage?: number
}

export default class GetPaginatedCourses {
  static async handle({ organization, filters, page = 1, perPage = 25 }: Params) {
    const statuses = await organization.getStatuses().select('id', 'name')
    const query = organization
      .related('courses')
      .query()
      .if(filters, (q) => this.#queryWithFilters(q, filters!))
      .preload('status')
      .preload('difficulty')
      .preload('accessLevel')
      .withCount('lessons')
      .withCount('modules')
      .orderBy('order')

    statuses.map((status) => {
      const name = `lessons_count__${string.snakeCase(status.name)}`
      query.withCount('lessons', (q) => q.where('lessons.status_id', status.id).as(name))
    })

    return query.paginate(page, perPage)
  }

  static #queryWithFilters(query: Query, filters: Filters) {
    StringFilter.build(query, 'name', filters.name)
    NumbersFilter.build(query, 'statusId', filters.statusId)
    NumbersFilter.build(query, 'difficultyId', filters.difficultyId)
    NumbersFilter.build(query, 'accessLevelId', filters.accessLevelId)
  }
}
