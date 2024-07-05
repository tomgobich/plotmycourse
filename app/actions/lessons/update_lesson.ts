import Organization from '#models/organization'
import { lessonValidator } from '#validators/lesson'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof lessonValidator>
}

export default class UpdateLesson {
  static async handle({ organization, id, data }: Params) {
    const lesson = await organization.findLesson(id)

    await lesson.merge(data).save()

    return lesson
  }
}
