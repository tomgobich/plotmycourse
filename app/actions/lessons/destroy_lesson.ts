import Organization from '#models/organization'
import db from '@adonisjs/lucid/services/db'

type Params = {
  organization: Organization
  id: number
}

export default class DestroyLesson {
  static async handle({ organization, id }: Params) {
    const lesson = await organization.findLesson(id)

    await db.transaction(async (trx) => {
      organization.useTransaction(trx)
      lesson.useTransaction(trx)

      await lesson.delete()
      await organization
        .related('lessons')
        .query()
        .if(
          lesson.moduleId,
          (query) => query.where('moduleId', lesson.moduleId),
          (query) => query.whereNull('moduleId')
        )
        .where('order', '>', lesson.order)
        .decrement('order')
    })

    return lesson
  }
}
