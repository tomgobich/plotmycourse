import Organization from '#models/organization'
import { lessonTypeDestroyValidator } from '#validators/lesson_type'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  id: number
  data: Infer<typeof lessonTypeDestroyValidator>
}

export default class DestroyLessonType {
  static async handle({ organization, id, data }: Params) {
    await db.transaction(async (trx) => {
      organization.useTransaction(trx)

      await organization.related('lessons').query().where('lessonTypeId', id).update({
        lessonTypeId: data.replacementId,
      })

      const lessonType = await organization
        .related('lessonTypes')
        .query()
        .where({ id })
        .firstOrFail()

      await lessonType.delete()
    })
  }
}
