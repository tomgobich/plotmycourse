import Organization from '#models/organization'
import { lessonPatchTagValidator } from '#validators/lesson'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof lessonPatchTagValidator>
}

export default class UpdateLessonTag {
  static async handle({ organization, id, data }: Params) {
    const lesson = await organization.findLesson(id)

    await lesson.merge(data).save()

    return lesson
  }
}
