import Organization from '#models/organization'
import { lessonTypeValidator } from '#validators/lesson_type'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  data: Infer<typeof lessonTypeValidator>
}

export default class StoreLessonType {
  static async handle({ organization, data }: Params) {
    const order = await organization.findNextSort('lessonTypes')

    return organization.related('lessonTypes').create({
      ...data,
      order,
    })
  }
}
