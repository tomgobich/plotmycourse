import NumbersFilter from '#actions/filters/numbers_filter'
import StringFilter from '#actions/filters/string_filter'
import Course from '#models/course'
import Organization from '#models/organization'
import { coursesFilterValidator } from '#validators/course'
import { HasManyQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import { Infer } from '@vinejs/vine/types'

type Filters = Infer<typeof coursesFilterValidator>
type Query = HasManyQueryBuilderContract<typeof Course, Course>

type Params = {
  organization: Organization
  filters?: Filters
}

export default class GetCourses {
  static async handle({ organization, filters }: Params) {
    return organization
      .related('courses')
      .query()
      .if(filters, (query) => this.#queryWithFilters(query, filters!))
      .preload('status')
      .preload('difficulty')
      .preload('accessLevel')
      .withCount('lessons')
      .withCount('modules')
      .orderBy('order')
  }

  static #queryWithFilters(query: Query, filters: Filters) {
    StringFilter.build(query, 'name', filters.name)
    NumbersFilter.build(query, 'statusId', filters.statusId)
    NumbersFilter.build(query, 'difficultyId', filters.difficultyId)
    NumbersFilter.build(query, 'accessLevelId', filters.accessLevelId)
  }
}
