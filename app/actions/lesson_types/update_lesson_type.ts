import Organization from '#models/organization'
import { lessonTypeValidator } from '#validators/lesson_type'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof lessonTypeValidator>
}

export default class UpdateLessonType {
  static async handle({ organization, id, data }: Params) {
    const lessonType = await organization.related('lessonTypes').query().where({ id }).firstOrFail()

    await lessonType.merge(data).save()

    return lessonType
  }
}
