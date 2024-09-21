import Course from '#models/course'
import Organization from '#models/organization'
import { courseShowFilterValidator } from '#validators/course'
import { Infer } from '@vinejs/vine/types'

type Filters = Infer<typeof courseShowFilterValidator>

type Params = {
  id: number
  organization: Organization
  filters?: Filters
}

export default class GetCourse {
  static async handle({ organization, id, filters }: Params) {
    const course = await organization.findCourse(id)
    const modules = await this.#getModules(course, filters)

    await course.load('accessLevel')
    await course.load('difficulty')
    await course.load('status')
    await course.loadCount('lessons')

    return { course, modules }
  }

  static async #getModules(course: Course, filters?: Filters) {
    if (filters?.excludeModules) return

    return course
      .related('modules')
      .query()
      .preload('status')
      .preload('lessons', (lessons) =>
        lessons.preload('accessLevel').preload('status').orderBy('order')
      )
      .orderBy('order')
  }
}
