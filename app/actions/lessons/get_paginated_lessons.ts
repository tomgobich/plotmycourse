import NumbersFilter from '#actions/filters/numbers_filter'
import StringFilter from '#actions/filters/string_filter'
import Lesson from '#models/lesson'
import Organization from '#models/organization'
import { lessonsFilterValidator } from '#validators/lesson'
import { HasManyQueryBuilderContract } from '@adonisjs/lucid/types/relations'
import { Infer } from '@vinejs/vine/types'

type Filters = Infer<typeof lessonsFilterValidator>
type Query = HasManyQueryBuilderContract<typeof Lesson, Lesson>

type Params = {
  organization: Organization
  page?: number
  perPage?: number
  filters?: Filters
}

export default class GetPaginatedLessons {
  static async handle({ organization, filters, page = 1, perPage = 25 }: Params) {
    return organization
      .related('lessons')
      .query()
      .if(filters, (query) => this.#queryWithFilters(query, filters))
      .preload('status')
      .preload('accessLevel')
      .preload('module', (query) => query.preload('course'))
      .orderBy('updatedAt', 'desc')
      .paginate(page, perPage)
  }

  static #queryWithFilters(query: Query, filters: Filters) {
    StringFilter.build(query, 'name', filters?.name)
    NumbersFilter.build(query, 'statusId', filters?.statusId)
    NumbersFilter.build(query, 'accessLevelId', filters?.accessLevelId)

    if (filters?.publishAt?.after && filters.publishAt.before) {
      query.whereBetween('publishAt', [filters.publishAt.after, filters.publishAt.before])
    } else if (filters?.publishAt?.after) {
      query.where('publishAt', '>', filters.publishAt.after)
    } else if (filters?.publishAt?.before) {
      query.where('publishAt', '<', filters.publishAt.before)
    }
  }
}
