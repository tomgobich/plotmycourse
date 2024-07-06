import Organization from '#models/organization'
import db from '@adonisjs/lucid/services/db'

type Params = {
  organization: Organization
  moduleId: number
  id: number
}

export default class DestroyLesson {
  static async handle({ organization, moduleId, id }: Params) {
    const module = await organization.findModule(moduleId)
    const lesson = await module.findLesson(id)

    await db.transaction(async (trx) => {
      module.useTransaction(trx)
      lesson.useTransaction(trx)

      await lesson.delete()
      await module.related('lessons').query().where('order', '>', lesson.order).decrement('order')
    })

    return lesson
  }
}
