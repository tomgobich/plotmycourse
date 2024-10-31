import Course from '#models/course'
import Organization from '#models/organization'

type Params = {
  organization: Organization
  ids: number[]
}

export default class UpdateCourseOrder {
  static async handle({ organization, ids }: Params) {
    const courses = await organization.related('courses').query().orderBy('order')

    return this.#updateOrder(courses, ids)
  }

  static async #updateOrder(courses: Course[], ids: number[]) {
    const promises = ids.map((id, order) => {
      const course = courses.find((record) => record.id === id)

      course?.merge({ order })

      return course?.save()
    })

    return Promise.all(promises)
  }
}
