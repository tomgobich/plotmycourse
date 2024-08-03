import GetSanitizedHtml from '#actions/sanitize/get_sanitized_html'
import Organization from '#models/organization'
import { lessonNotesValidator } from '#validators/lesson'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof lessonNotesValidator>
}

export default class UpdateLessonNotes {
  static async handle({ organization, id, data }: Params) {
    const lesson = await organization.findLesson(id)
    const notes = GetSanitizedHtml.handle({ html: data.notes })

    await lesson.merge({ notes }).save()

    return lesson
  }
}
