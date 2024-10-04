import LessonType from '#models/lesson_type'
import Organization from '#models/organization'

type Params = {
  organization: Organization
  ids: number[]
}

export default class UpdateLessonTypeOrder {
  static async handle({ organization, ids }: Params) {
    const lessonTypes = await organization.getLessonTypes()

    return this.#updateOrder(lessonTypes, ids)
  }

  static async #updateOrder(lessonTypes: LessonType[], ids: number[]) {
    const promises = ids.map((id, order) => {
      const lessonType = lessonTypes.find((record) => record.id === id)
      const isDefault = order === 0

      lessonType?.merge({
        order,
        isDefault,
      })

      return lessonType?.save()
    })

    return Promise.all(promises)
  }
}
